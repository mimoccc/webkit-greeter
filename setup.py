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
	
try:
	import gconf
	gconf_loaded = True
except ImportError:
	gconf_loaded = False

class LogWin(gtk.Window):

	url = 'file:///usr/share/webkit-logon/setup.html'

	def get_background_image(self):
		client = gconf.client_get_default()
		current_bg = client.get_string("/desktop/gnome/background/picture_filename")
		return current_bg

	def __init__(self, args):
		gtk.Window.__init__(self)
		self.set_default_size(gtk.gdk.screen_width()-200,gtk.gdk.screen_height()-200)
		self.set_position(gtk.WIN_POS_CENTER)
		self.connect("delete-event", lambda a,b: gtk.main_quit())
		self.view = webkit.WebView()
		self.add(self.view)
		settings = webkit.WebSettings()
		settings.set_property("enable-plugins", False)
		settings.set_property('enable-file-access-from-file-uris', 1)
		settings.set_property('enable-default-context-menu', False)
		self.view.set_settings(settings)
		self.view.connect("console-message", self.console)
		self.view.connect('load-finished', self._finished_loading)
		self.view.connect('title-changed', self.title_changed)
		self.view.open(self.url)
		self.view.show_all()
		self.show_all()
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

		if(cmd=='exit'):
			self.udata.close()
			self.exit()
			pass

### MAIN ###########################################################################
mainloop = gobject.MainLoop()
win = LogWin(sys.argv)
gtk.main()
####################################################################################