![Easy Odoo Dev Image](/example/header.png)

# Easy Odoo Dev

This small extension allows you to manage your Odoo configuration file directly from the Visual Studio Code right panel.

The extension includes all the options available in the Odoo 19.0 CLI.

A short description of each option is displayed directly in VSC. For more information, please refer to the [Odoo documentation](https://www.odoo.com/documentation/19.0/developer/reference/cli.html).

Funny point this extension is partially developed using Odoo OWL itself! 🎉

## Features

- Edit all options available in the Odoo CLI.
- Launch an Odoo server.
- Launch an Odoo server in debugging mode (requires debugpy).
- Open the config directly.
- Drop the current database.

Please note that if you edit the Odoo config file directly and add it to the extension, the changes will only take effect after reloading the extension. If the settings are edited in the extension without reloading, they will override the changes.

## License

OWL is licensed under the GNU Lesser General Public License v3.0 (LGPL-3.0).
Full license file is available in owl.js
