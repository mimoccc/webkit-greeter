#!/usr/bin/env python
#-*- coding: utf-8-*-

#IMPORTS
try:
	import json
	json_loaded = True
except ImportError:
	json_loaded = False
try:
	import re
	re_loaded = True
except ImportError:
	re_loaded = False
try:
	import xdg.IconTheme as xdgicon
	xdgicon_loaded = True
except ImportError:
	xdgicon_loaded = False
try:
	import gmenu
	gmenu_loaded = True
except ImportError:
	gmenu_loaded = False
try:
	import os
	os_loaded = True
except ImportError:
	os_loaded = False
try:
	import sys
	sys_loaded = True
except ImportError:
	sys_loaded = False
try:
	import pwd
	import grp
	pwd_loaded = True
except ImportError:
	pwd_loaded = False
try:
	import gtk
	gtk_loaded = True
except ImportError:
	gtk_loaded = False
try:
	import gobject
	gobject_loaded = True
except ImportError:
	gobject_loaded = False
try:
	import socket
	socket_loaded = True
except ImportError:
	socket_loaded = False	
try:
	import dbus
	import dbus
	import dbus.bus
	import dbus.exceptions
	import dbus.mainloop.glib
	dbus_loaded = True
except ImportError:
	dbus_loaded = False
try:
	import logging
	logging_loaded = True
except ImportError:
	logging_loaded = False
try:
	import webkit
	webkit_loaded = True
except ImportError:
	webkit_loaded = False
try:
	import Image
	pimage_loaded = True
except ImportError:
	pimage_loaded = False
try:
	import sqlite
	sqlite_loaded = True
except ImportError:
	sqlite_loaded = False
try:
	import cairo
	cairo_loaded = True
except ImportError:
	cairo_loaded = False
try:
	import gconf
	gconf_loaded = True
except ImportError:
	gconf_loaded = False

#GLOBALS

re_command = re.compile('%[UFuf]')
cmd_terminal = 'gnome-terminal -e'
include_nodisplay = False

#CLASSES

class AppsMenu(object):
    def __init__(self):
        self.trees = []
        self.trees.append(self.create_tree('applications.menu'))
        self.trees.append(self.create_tree('settings.menu'))

    def create_menu_item(self, entry):    
        icon = entry.get_icon()
        name = entry.get_name()
        dpath = entry.get_desktop_file_path()
        menu_item = []
        if (icon):
            menu_item.append(name)
            icon_path = xdgicon.getIconPath(icon)
            if icon_path:
            	menu_item.append(icon_path)
            else:
            	menu_item.append(icon)
        else:
        	menu_item.append(name)
        if entry.get_type() ==  gmenu.TYPE_ENTRY:
            menu_item.append(dpath)
        return menu_item

    def process_entry(self, menu, entry):
        menu.append(self.create_menu_item(entry))

    def process_directory(self, menu, dir):
        if dir:
            for item in dir.get_contents():
                type = item.get_type()
                if type == gmenu.TYPE_ENTRY:
                    self.process_entry(menu, item)
                elif type == gmenu.TYPE_DIRECTORY:
                    new_menu = []
                    menu_item = self.create_menu_item(item)
                    menu_item.append(new_menu)
                    menu.append(menu_item)
                    self.process_directory(new_menu, item)
                elif type == gmenu.TYPE_ALIAS:
                    aliased = item.get_item()
                    if aliased.get_type() == gmenu.TYPE_ENTRY:
                        self.process_entry(menu, aliased)
                elif type == gmenu.TYPE_SEPARATOR:
                    pass
                elif type in [ gmenu.TYPE_HEADER ]:
                    pass
                else:
                    print >> sys.stderr, 'Unsupported item type: %s' % type


    def add_to_menu(self, menu, tree):
        root = tree.get_root_directory()    
        self.process_directory(menu, root)

    def create_menu(self):
        menu = []
        for t in self.trees:
            self.add_to_menu(menu, t)
        return menu;

    def create_tree(self, name):
        flags = gmenu.FLAGS_NONE
        if include_nodisplay:
            flags = flags | gmenu.FLAGS_INCLUDE_NODISPLAY
        tree = gmenu.lookup_tree(name, flags)        
        return tree

class DWin(gtk.Window):

	url = 'file://'+ os.path.dirname(sys.argv[0]) +'/index.html'
	#url = 'http://2advanced.com/#/home'
	#url = 'http://www.mygoya.de/usthon'
	#url = 'http://www.glidedigital.com/'
	#url = 'https://www.icloud.com/'
	#url = 'http://www.yoodos.com/'
	#url = 'http://www.7diamonds.com/'
	#url = ''
	#url = ''
	#url = ''
	#url = 'file://localhost/home/mimo/Plocha/local%20storage/twitter-search-fast.html'
	#url = 'http://www.netvibes.com/privatepage/1#Internet'

	def transparent_expose(self, widget, event):
		cr = widget.window.cairo_create()
		cr.set_operator(cairo.OPERATOR_CLEAR)
		region = gtk.gdk.region_rectangle(event.area)
		cr.region(region)
		cr.fill()
	
	def no_delete(self,a,b):
		return True

	def get_background_image(self):
		client = gconf.client_get_default()
		current_bg = client.get_string("/desktop/gnome/background/picture_filename")
		return current_bg

	def __init__(self, args):
		print os.path.dirname(sys.argv[0])   
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
		self.generate_apps_menu()

	def restart_computer(self):
		os.execl('/sbin/shutdown',' -r now')

	def generate_apps_menu(self):
		self.menu = AppsMenu()  
		self.view.execute_script('window.apps = '+ json.dumps(self.menu.create_menu()) +';') 

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

	def _finished_loading(self, view, frame):
		pass
		
	def get_html(self):
		self.execute_script('oldtitle=document.title;document.title=document.documentElement.innerHTML;')
		html = self.get_main_frame().get_title()
		self.execute_script('document.title=oldtitle;')
		return html

	def console(self, webview, message, lineno, fileurl):
		print([message, lineno, fileurl]);    
		webview.stop_emission("console-message")

	def title_changed(self, widget, frame, title):
		args = title.split(':')
		cmd = args[0]

		if(cmd=='genappsmenu'):
			self.generate_apps_menu()

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

		if(cmd=='exit'):
			self.udata.close()
			self.exit()

### MAIN ###########################################################################
dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
mainloop = gobject.MainLoop()
win = DWin(sys.argv)
gtk.main()
####################################################################################