#!/usr/bin/env python

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

#import libgmail
#import json
#import pygame
#import Image
#from pygame.locals import *
#import opencv
#from opencv import highgui 
#import time
#import locale

#class server():
#	host = ''
#	port = 50000
#	backlog = 5
#	size = 1024
#	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#	s.bind((host,port))
#	s.listen(backlog)
#	while 1:
#	    client, address = s.accept()
#	    data = client.recv(size)
#	    if data:
#		client.send(data)
#	    client.close() 

class UsersCache():
	def __init__(self, fpath):
		self.connection = sqlite.connect('/usr/share/webkit-logon/data/users.db')
		#self.connection = sqlite.connect(':memory:')
		self.cursor = self.connection.cursor()
		try:
		    self.cursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, data TEXT)')
		    self.connection.commit()
		except Exception as err:
			print err
			pass
			
	def user_exists(self, id):
		try:
			self.cursor.execute('SELECT * FROM users WHERE id='+str(id))
			return self.cursor.rowcount
		except Exception as err:
			print err
			pass

	def create_user(self, id):
		try:
			if(self.user_exists(id)<1):
				self.cursor.execute('INSERT INTO users (id) VALUES ('+ str(id) +')')
				self.connection.commit()
		except Exception as err:
			print err
			pass
	
	def update_user(self, id, data):
		try:
			if(self.user_exists(id)>0):
				self.cursor.execute('UPDATE users SET data=\''+ str(data) +'\' WHERE id = '+ str(id))
				self.connection.commit()
		except Exception as err:
			print err
			pass
		
	#def get_user_data(self.id):
	#	pass
		
	#self.cursor.execute('SELECT * FROM users')
	#print self.cursor.fetchall()
	#cursor.fetchone()
	
	def close(self):
		try:
			self.cursor.close()
			self.connection.close()
		except Exception as err:
			print err
			pass

#class capturePic():

#	def __init__(self, username='root'):
#		self.filename = '/usr/share/webkit-logon/users/'+username+'.png'
#		self.fps = 30.0
#		self.camera = highgui.cvCreateCameraCapture(0)
#		pygame.init()
#		self.window = pygame.display.set_mode((640,480))
#		pygame.display.set_caption("Capture Photo")
#		self.screen = pygame.display.get_surface()
#		while True:
#			self.events = pygame.event.get()
#			for event in self.events:
#				if event.type == QUIT or event.type == KEYDOWN:
#					return
#			self.im = opencv.adaptors.Ipl2PIL(highgui.cvQueryFrame(self.camera))
#			self.pg_img = pygame.image.frombuffer(self.im.tostring(), self.im.size, self.im.mode)
#			self.screen.blit(self.pg_img, (0,0))
#			pygame.display.flip()
#			pygame.time.delay(int(1000 * 1.0/self.fps))
#			pygame.image.save(self.pg_img, self.filename)

#class gmail():

#	def __init__(self, email, password):
#		ga = libgmail.GmailAccount("google@gmail.com", "mymailismypass")
#		ga.login()
#		folder = ga.getMessagesByFolder('inbox')
#		for thread in folder:
#			print thread.id, len(thread), thread.subject
#			for msg in thread:
#				print "  ", msg.id, msg.number, msg.subject
#				print msg.source

class Log():

	def __init__(self, logfilename, logformat, test):
		self.test = test
		if(not(self.test)):
			logging.basicConfig(format=logformat, filename=logfilename, filemode='w', level=logging.DEBUG)

	def i(self, text, data={}):
		if(not(self.test)):
			logging.info('%s', text, extra=data)
		else:
			print(text)

	def d(self, text, data={}):
		if(not(self.test)):
			logging.debug('%s', text, extra=data)
		else:
			print(text)

	def e(self, text, data={}):
		if(not(self.test)):
			logging.error('%s', text, extra=data)
		else:
			print(text)

	def w(self, text, data={}):
		if(not(self.test)):
			logging.warning('%s', text, extra=data)
		else:
			print(text)

class GdmDbusService(object):

	def __init__(self, log):
		self.log = log
		try:
			self.log.i('connecting address: ' + self.address + ' path: ' + self.path)
			self.raw = self.connection.get_object(self.address, self.path)
			self.log.i('connected')
		except dbus.exceptions.DBusException:
			self.log.i('can not connect address: ' + self.address + ' path: ' + self.path)
			raise
		self.obj = dbus.Interface(self.raw, self.interface)
		self.connection.add_signal_receiver(
			self.got_signal,
			dbus_interface=self.interface, 
			signal_name=None, 
			bus_name=None, 
			path=self.path,
			sender_keyword="sent", 
			destination_keyword="dest", 
			interface_keyword=None,
			member_keyword="name", 
			path_keyword=None, 
			message_keyword=None
		)

	def got_signal(self, *args, **kwargs):
		name = kwargs.pop('name', 'Unknown')
		if hasattr(self, name):
			getattr(self, name)( *args )
		else:
			for key in kwargs.keys():
				if kwargs[key] == None:
					kwargs.pop(key)

class GdmGreeter(GdmDbusService):

	path = '/org/gnome/DisplayManager/GreeterServer'
	address = 'org.gnome.DisplayManager.GreeterServer'
	interface = 'org.gnome.DisplayManager.GreeterServer'

	def __init__(self, log, webkitview, dbus_address):
		self.uname = ''
		self.upass = ''
		self.view = webkitview
		self.log   = log
		self.dbus_address = dbus_address
		self.connection = False
		try:
			self.log.i('connecting to greeter service')
			self.connection = dbus.connection.Connection(self.dbus_address)
			self.log.i('greeter service connected')
		except dbus.exceptions.DBusException:
			self.log.i('can not connect greeter service')
			raise
		self.log.i('attaching greeter service')
		super(GdmGreeter, self).__init__(self.log)
		self.log.i('attaching greeter display service')
		self.display = GdmDisplay(self.log, self.obj.GetDisplayId())
		pass

	def Info(self, text):
		self.log.i('info:'+text)
		self.view.execute_script('window.App.info("'+ text +'");')
		pass

	def Problem(self, text):
		self.log.i('problem:'+text)
		self.view.execute_script('window.App.problem("'+ text +'");')
		pass

	def InfoQuery(self, text):
		self.log.i(text)
		self.view.execute_script('window.App.infoQuery("'+ text +'");')
	pass

	def SecretInfoQuery(self, text):
		self.view.execute_script('window.App.secretInfoQuery("'+ text +'");')
		self.log.i('sending greeter service password')
		self.obj.AnswerQuery(self.upass)
		pass

	def SelectedUserChanged(self, username):
		self.log.i('user changed: '+username)
		self.view.execute_script('window.App.selectedUserChanged("'+ username +'");')
		pass

	def DefaultLanguageNameChanged(self, language_name):
		self.view.execute_script('window.App.defaultLanguageNameChanged("'+ language_name +'");')
		pass

	def DefaultLayoutNameChanged(self, layout_name):
		self.view.execute_script('window.App.defaultLayoutNameChanged("'+ layout_name +'");')
		pass

	def DefaultSessionNameChanged(self, session_name):
		self.view.execute_script('window.App.defaultSessionNameChanged("'+ session_name +'");')
		pass

	def SelectUser(self, username):
		self.log.i('selecting user: '+username)
		self.view.execute_script('window.App.selectUser("'+ username +'");')
		pass
	
	def TimedLoginRequested(self, username, delay):
		self.log.i('timed logged in')
		self.view.execute_script('window.App.timedLoginRequested("'+ username +'", '+ str(delay) +');')
		pass

	def Ready(self):
		self.log.i('greeter service ready')
		self.view.execute_script('window.App.ready();')
		pass

	def Reset(self):
		self.log.i('greeter service reset')
		self.view.execute_script('window.App.reset();')
		pass

	def UserAuthorized(self):
		self.view.execute_script('window.App.userAuthorized();')
		self.log.i('user logged in')
		pass
	
	def login(self, uid, uname, upass):
		self.log.i('authentificating user: '+uname)
		self.uid = uid
		self.uname = uname
		self.upass = upass
		self.obj.BeginVerificationForUser(self.uname)

	def setSession(self, session):
		self.log.i('setting session:'+session)
		self.obj.SelectSession(session)

# methods:
# BeginVerification ( )
# BeginVerificationForUser ( s username )
# BeginTimedLogin ( )
# AnswerQuery ( s text ) 
# SelectSession ( s text )
# SelectHostname ( s text )
# SelectLanguage ( s text )
# SelectUser ( s text )
# Cancel ( )
# Disconnect ( )
# GetDisplayId ( ) -> ( s id )
# StartSessionWhenReady ( b should_start_session )

class GdmDisplay(GdmDbusService):

	address = 'org.gnome.DisplayManager'
	interface = 'org.gnome.DisplayManager.Display'

	def __init__(self, log, path):
		self.log = log
		self.connection = dbus.SystemBus()
		self.path = path
		super(GdmDisplay, self).__init__(self.log)

	@property
	def name(self):
		return self.obj.GetX11DisplayName()

	@property
	def number(self):
		return self.obj.GetX11DisplayNumber()

class LogWin(gtk.Window, GdmGreeter):

	url = 'file://'+ os.path.dirname(sys.argv[0]) +'/index.html'
	#url = 'file:///usr/share/webkit-logon/index.html'
	sdir = '/usr/share/xsessions/'
	udata = UsersCache('/usr/share/webkit-logon/data/users.db')
	
	def no_delete(self,a,b):
		return True

	def transparent_expose(self, widget, event):
		cr = widget.window.cairo_create()
		cr.set_operator(cairo.OPERATOR_CLEAR)
		region = gtk.gdk.region_rectangle(event.area)
		cr.region(region)
		cr.fill()

	def __init__(self, args):
		
		#aa = capturePic('mimo')
		
		if(len(args)>1):
			self.test = (args[1]=='test')
		else:
			self.test = False
		self.log = Log('/var/log/gdm/gdm-webkit-greeter.log','%(asctime)-15s %(message)s', self.test)
		self.args = args
		self.log.i('starting gdm-webkit-greeter')
		gtk.gdk.threads_init()
		gtk.remove_log_handlers()
		gtk.Window.__init__(self, gtk.WINDOW_TOPLEVEL)
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
		if(not(self.test)):
			self.connect('delete-event', self.no_delete)
		else:
			self.connect('delete-event', self.exit)
		self.view.connect("console-message", self.console)
		self.view.connect('load-finished', self._finished_loading)
		self.view.connect('title-changed', self.title_changed)
		self.view.show_all()
		self.show_all()
		self.fullscreen()
		self.view.open(self.url)
		self.log.i('interface created')
		pass

	def startsession(self):
		self.log.i('logon ok, starting session')
		if(not(self.test)):
			self.greeter.obj.StartSessionWhenReady( True )
			self.greeter.obj.Disconnect()
		self.exit()

	def restart_computer(self):
		self.log.i('restarting...')
		os.execl('/sbin/shutdown',' -r now')

	def halt_computer(self):
		self.log.i('shuting down...')
		os.execl('/sbin/shutdown',' -h now')
	
	def hibernate_computer(self):
		self.log.i('hibernating...')
		os.execl('','')

	def exit(self,a=False,b=False):
		self.udata.close()
		self.view.hide()
		self.hide()
		self.unfullscreen()
		mainloop.quit()
		gtk.main_quit()
		sys.exit(0)
		pass

	def makeSessions(self):
		s = 'if(!(window.logon instanceof Object)) window.logon = {};\n'
		s += 'logon.sessions = [\n'
		s += '{ "name" : "last used session", "fpath":"" },'
		for filename in os.listdir(os.path.abspath(self.sdir)):
			if(filename[0] != '.'):
				if os.access(self.sdir + filename, os.R_OK):
					s += '{ \n'
					with open(self.sdir + filename) as fp:
						ss = (fp.read()).split('\n')
						for sss in ss :
							if(len(sss)>0):
								if(not(sss[0]=='#')):
									if(not(sss=='[Desktop Entry]')):
										si = sss.split('=')
										if len(si)>1:
											s += '"' + si[0].lower() + '" : "' + si[1] + '",'
					s += ' "fpath" : "' + self.sdir + filename + '"'
					s += "},\n"
		s = s[0:(len(s)-2)]
		s += "];\n"
		self.view.execute_script(s)

	def makeUsers(self):
		self.log.i('recreating users')
		script  = 'if(typeof(window.logon)==="undefined") window.logon = {};'
		script += 'window.logon.users = [];'
		#print script
		self.view.execute_script(script)
		for p in pwd.getpwall():
			if(p[2]>999):
				self.udata.create_user(p[2])
				u_photo = '/usr/share/webkit-logon/users/nobody.png';
				if(os.path.exists('/usr/share/webkit-logon/users/'+ p[0] +'.png')):
					u_photo = '/usr/share/webkit-logon/users/'+ p[0] +'.png'#300x200
				#else:
					#if(os.path.exists('/home/'+p[0]+'/.face')):
						#im = Image.open('/home/'+p[0]+'/.face')
						#/im.thumbnail((300, 200))
						#im.show()
						#im.save('users/'+ p[0] +'.png', "PNG")
						#u_photo = '/usr/share/webkit-logon/users/'+ p[0] +'.png'#300x200
				self.log.i('image:'+u_photo)
				g_name = grp.getgrgid(p[3])[0]
				u_details = 'no details yet, please configure your account in user configurator.'
				script = '{';
				script += 'id:'+ str(p[2])+',';
				script += 'password:"",';
				script += 'name:"'+ p[0] + '",';
				script += 'gid:'+ str(p[3]) +',';
				script += 'g_name:"'+ g_name +'",';
				script += 'details:"'+ u_details +'",';#to do
				script += 'gecos:"'+ p[4] +'",';
				script += 'home_dir:"'+ p[5] +'",';
				script += 'shell:"'+ p[6] +'",';
				script += 'photo:"'+ u_photo+'",';
				script += 	'toString : function () {';
				script += 		'var ret = "";';
				script += 		'ret += this.id + ":";';
				script += 		'ret += this.password+ ":";';
				script += 		'ret += this.name;';
				script += 		'return ret;';
				script += 	'}';
				script += '}';
				self.log.i('adding user: (id:'+ str(p[2]) +', name:'+ p[0] +')')
				#print 'if((window.logon)&&(window.logon.users)) window.logon.users.push(' + script +');'
				self.udata.update_user(p[2],script)
				self.view.execute_script('if((window.logon)&&(window.logon.users)) window.logon.users.push(' + script +');')
		pass

	def _finished_loading(self, view, frame):
		self.makeSessions()
		self.makeUsers()
		self.view.execute_script('mjdevjs.onAppStart.fire();')
		self.log.i('greeter started')
		if(not(self.test)):
			self.greeter = GdmGreeter(self.log, self.view, os.environ['GDM_GREETER_DBUS_ADDRESS'])
		else:
			self.log.i('greeter service ready')
			self.view.execute_script('window.App.ready();')
		pass

	def get_html(self):
		self.execute_script('oldtitle=document.title;document.title=document.documentElement.innerHTML;')
		html = self.get_main_frame().get_title()
		self.execute_script('document.title=oldtitle;')
		return html

	def console(self, webview, message, lineno, fileurl):
		self.log.e('got script or css or html error:')
		self.log.e('script: ' + fileurl +', line: '+ str(lineno) + "\n" + message + "\n")
		webview.stop_emission("console-message")
		pass

	def title_changed(self, widget, frame, title):
		self.log.i('got result from greeter')
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
		
		#if(cmd=='comphibernate'):
			#if(not(self.test)):
				#self.halt_computer()
			#else:
				#self.exit()

		if(cmd=='sessionslist'):
			self.makeSessions()
			pass

		if(cmd=='userlist'):
			self.makeUsers()
			pass

		if(cmd=='exit'):
			self.udata.close()
			self.exit()
			pass

		if(cmd=='startsession'):
			if(not(self.test)):
				self.udata.close()
				self.startsession()
				self.exit()
			else:
				self.exit()

		if(cmd=='setsession'):
			if(not(self.test)):
				self.greeter.setSession(args[1])
			else:
				pass

		if(cmd=='login'):
			uid = args[1]
			uname = args[3]
			upass = args[2]
			self.log.i('login user: '+ uname +' uid: ' + uid)
			if(self.test):
				if(upass==''):
					self.view.execute_script('window.App.userAuthorized();')
					self.log.i('user logged in')
				else:
					self.view.execute_script('window.App.problem("auth error");')
			else:
				self.greeter.login(uid, uname, upass)
		pass

### MAIN ###########################################################################
dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
mainloop = gobject.MainLoop()
win = LogWin(sys.argv)
gtk.main()
####################################################################################
