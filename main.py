import pygtk
import gtk
import sys
import webkit
import gobject
import gnomevfs
import json
import os
import os.path
import xdg.Menu
import xdg.DesktopEntry
import gconf
try:
	import cairo
	cairo_loaded = True
except ImportError:
	cairo_loaded = False

class ODict():
    """An ordered dictionary.
    Has only the most needed functions of a dict, not all."""
    def __init__(self, d=[]):
        if not type(d) in (list, tuple):
            raise TypeError(
                        "The argument has to be a list or a tuple or nothing.")
        self.list = []
        for t in d:
            if not type(d) in (list, tuple):
                raise ValueError(
                        "Every item of the list has to be a list or a tuple.")
            if not len(t) == 2:
                raise ValueError(
                        "Every tuple in the list needs to be two items long.")
            self.list.append(t)

    def __getitem__(self, key):
        return self.get(key)

    def __setitem__(self, key, value):
        t = (key, value)
        self.list.append(t)

    def __delitem__(self, key):
        self.remove(key)

    def __len__(self):
        self.list.__len__()

    def __contains__(self, key):
        for t in self.list:
            if t[0] == key:
                return True
        else:
            return False

    def __iter__(self):
        return self.keys().__iter__()

    def __eq__(self, x):
        if type(x) == dict:
            d = {}
            for t in self.list:
                d[t[0]] = t[1]
            return (d == x)
        elif x.__class__ == self.__class__:
            return (self.list == x.list)
        else:
            return (self.list == x)

    def __len__(self):
        return len(self.list)

    def values(self):
        values = []
        for t in self.list:
            values.append(t[1])
        return values

    def keys(self):
        keys = []
        for t in self.list:
            keys.append(t[0])
        return keys

    def items(self):
        return self.list

    def add_at_index(self, index, key, value):
        t = (key, value)
        self.list.insert(index, t)

    def get(self, key, default=None):
        for t in self.list:
            if t[0] == key:
                return t[1]
        return default

    def get_index(self, key):
        for t in self.list:
            if t[0] == key:
                return self.list.index(t)

    def move(self, key, index):
        for t in self.list:
            if key == t[0]:
                self.list.remove(t)
                self.list.insert(index, t)

    def remove(self, key):
        for t in self.list:
            if key == t[0]:
                self.list.remove(t)

    def has_key(self, key):
        for t in self.list:
            if key == t[0]:
                return True
        else:
            return False

class DesktopEntry(xdg.DesktopEntry.DesktopEntry):
    def __init__(self, file_name):
        xdg.DesktopEntry.DesktopEntry.__init__(self, file_name)
        # Quicklist
        self.quicklist = ODict()
        if not "X-Ayatana-Desktop-Shortcuts" in self.content["Desktop Entry"]:
            return
        entries = self.content["Desktop Entry"]["X-Ayatana-Desktop-Shortcuts"]
        entries = entries.split(";")
        for entry in entries:
            sg = self.content.get("%s Shortcut Group" % entry)
            if not sg:
                continue
            lo = locale.getlocale()[0]
            n = "Name[%s]"
            name = sg.get(n % lo) or sg.get(n % lo[:2])
            if name is None:
                for s in sg:
                    if s.startswith("Name[" + lo[:2]):
                        name = sg[s]
                        break
                else:
                    name = sg.get("Name")
            exe = sg.get("Exec")
            if name and exe:
                self.quicklist[name] = exe

    def launch(self, uri=None):
        os.chdir(os.path.expanduser("~"))
        command = self.getExec()
        if command == "":
            return

        # Replace arguments
        if "%i" in command:
            icon = self.getIcon()
            if icon:
                command = command.replace("%i","--icon %s"%icon)
            else:
                command = command.replace("%i", "")
        command = command.replace("%c", self.getName())
        command = command.replace("%k", self.getFileName())
        command = command.replace("%%", "%")
        for arg in ("%d", "%D", "%n", "%N", "%v", "%m", "%M","--view"):
            command = command.replace(arg, "")
        # TODO: check if more unescaping is needed.

        # Parse the uri
        uris = []
        files = []
        if uri:
            uri = str(uri)
            # Multiple uris are separated with newlines
            uri_list = uri.split("\n")
            for uri in uri_list:
                uri = uri.rstrip()
                file = uri

                # Nautilus and zeitgeist don't encode ' and " in uris and
                # that's needed if we should launch with /bin/sh -c
                uri = uri.replace("'", "%27")
                uri = uri.replace('"', "%22")
                uris.append(uri)

                if file.startswith("file://"):
                    file = file[7:]
                file = file.replace("%20","\ ")
                file = unquote(file)
                files.append(file)

        # Replace file/uri arguments
        if "%f" in command or "%u" in command:
            # Launch once for every file (or uri).
            iterlist = range(max(1, len(files)))
        else:
            # Launch only one time.
            iterlist = [0]
        for i in iterlist:
            cmd = command
            # It's an assumption that no desktop entry has more than one
            # of "%f", "%F", "%u" or "%U" in it's command. Othervice some
            # files might be launched multiple times with this code.
            if "%f" in cmd:
                try:
                    f = files[i]
                except IndexError:
                    f = ""
                cmd = cmd.replace("%f", f)
            elif "%u" in cmd:
                try:
                    u = uris[i]
                except IndexError:
                    u = ""
                cmd = cmd.replace("%u", u)
            elif "%F" in cmd:
                cmd = cmd.replace("%F", " ".join(files))
            elif "%U" in cmd:
                cmd = cmd.replace("%U", " ".join(uris))
            # Append the files last if there is no rule for how to append them.
            elif files:
                cmd = "%s %s"%(cmd, " ".join(files))

            logger.info("Executing: %s"%cmd)
            os.system("/bin/sh -c '%s' &"%cmd)

    def get_quicklist(self):
        return self.quicklist

    def launch_quicklist_entry(self, entry):
        if not entry in self.quicklist:
            return
        cmd = self.quicklist[entry]

        # Nautilus and zeitgeist don't encode ' and " in uris and
        # that's needed if we should launch with /bin/sh -c
        cmd = cmd.replace("'", "%27")
        cmd = cmd.replace('"', "%22")
        cmd = unquote(cmd)
        logger.info("Executing: %s"%cmd)
        os.system("/bin/sh -c '%s' &"%cmd)

    def getIcon(self, *args):
        try:
            return xdg.DesktopEntry.DesktopEntry.getIcon(self, *args)
        except:
            logger.warning("Couldn't get icon name from a DesktopEntry")
            return None

class MainWin(gtk.Window):
	url = 'file://'+ os.path.dirname(sys.argv[0]) +'/desktop.html'
	
	def get_menutree(self):
		self.menu_tree_model = menutreemodel.MenuTreeModel (menu_files) 
		pass    
	
	def get_apps(self, filename):
		mime_type = gnomevfs.get_mime_type(filename)
		application_list = gnomevfs.mime_get_all_applications(mime_type)
		return application_list   
	
	def get_background_image(self):
		client = gconf.client_get_default()
		current_bg = client.get_string("/desktop/gnome/background/picture_filename")
		return current_bg

	def transparent_expose(self, widget, event):
		cr = widget.window.cairo_create()
		cr.set_operator(cairo.OPERATOR_CLEAR)
		region = gtk.gdk.region_rectangle(event.area)
		cr.region(region)
		cr.fill()
	
	def no_delete(self,a,b):
		return True

	def __init__(self, args):
		gtk.gdk.threads_init()
		gtk.remove_log_handlers()
		gtk.Window.__init__(self)
		self.fullscreen()
		self.set_type_hint(gtk.gdk.WINDOW_TYPE_HINT_DOCK)
		self.set_keep_below(True)
		self.set_decorated(False)
		self.set_skip_taskbar_hint(True)
		self.set_skip_pager_hint(True)
		self.stick()
		self.screen = self.get_screen()
		self.rgba = self.screen.get_rgba_colormap()
		self.set_colormap(self.rgba)
		self.set_app_paintable(True)
		self.connect("expose-event", self.transparent_expose)
		self.view = webkit.WebView()
		self.view.set_transparent(True);
		self.add(self.view)
		settings = webkit.WebSettings()
		settings.set_property("enable-plugins", False)
		settings.set_property('enable-file-access-from-file-uris', 1)
		settings.set_property('enable-default-context-menu', False)
		self.view.set_settings(settings)
		self.view.connect("console-message", self.console)
		self.view.connect('load-finished', self._finished_loading)
		self.view.connect('title-changed', self.title_changed)
		self.view.show_all()
		self.show_all()
		self.fullscreen()
		self.view.open(self.url)
		pass

	def restart_computer(self):
		os.execl('/sbin/shutdown',' -r now')

	def halt_computer(self):
		os.execl('/sbin/shutdown',' -h now')
	
	def hibernate_computer(self):
		os.execl('','')

	def exit(self,a=False,b=False):
		self.view.hide()
		self.hide()
		self.unfullscreen()
		mainloop.quit()
		gtk.main_quit()
		sys.exit(0)
		pass

	def _finished_loading(self, view, frame):
		#self.view.execute_script('window.body.background = "'+ self.get_background_image() +'";')
		pass

	def get_html(self):
		self.execute_script('oldtitle=document.title;document.title=document.documentElement.innerHTML;')
		html = self.get_main_frame().get_title()
		self.execute_script('document.title=oldtitle;')
		return html

	def console(self, webview, message, lineno, fileurl):
		webview.stop_emission("console-message")
		pass

	def title_changed(self, widget, frame, title):
		args = title.split(':')
		cmd = args[0]

		if(cmd=='comprestart'):
			if(not(self.test)):
				self.restart_computer()
			else:
				self.exit()

		if(cmd=='comphalt'):
			if(not(self.test)):
				self.halt_computer()
			else:
				self.exit()
		
		if(cmd=='comphibernate'):
			if(not(self.test)):
				self.hibernate_computer()
			else:
				self.exit()

		if(cmd=='exit'):
			self.udata.close()
			self.exit()
			pass

def main(args):
	mainloop = gobject.MainLoop()
	win = MainWin(args)
	gtk.main()
	
def show_menu(menu, depth = 0):
	for entry in menu.getEntries():
		if isinstance(entry, xdg.Menu.Menu):
			show_menu(entry, depth)
		elif isinstance(entry, xdg.Menu.MenuEntry):
			print menu.getPath() + "/\t" + entry.DesktopFileID + "\t" + entry.DesktopEntry.getFileName()+ "\t" +entry.DesktopEntry.getIcon() 

show_menu(xdg.Menu.parse())
main(sys.argv)