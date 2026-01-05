export type Setting = {
  title: string;
  cli: string;
  file: string;
  description: string;
  isBoolean: boolean;
  value: string | boolean | number;
  messageKey?: string;
};

export const settings = {
  server: [
    {
      title: "Database",
      cli: "--database",
      file: "db_name",
      description: "Database(s) used when installing or updating modules.",
      isBoolean: false,
      value: "",
      messageKey: "load-databases",
    },
    {
      title: "Initialize Modules",
      cli: "--init",
      file: "init",
      description:
        "Comma-separated list of modules to install before running the server",
      isBoolean: false,
      value: "",
      messageKey: "load-available-modules",
    },
    {
      title: "Update Modules",
      cli: "--update",
      file: "update",
      description:
        "Comma-separated list of modules to update before running the server.",
      isBoolean: false,
      value: "",
      messageKey: "load-available-modules",
    },
    {
      title: "Reinitialize Modules",
      cli: "--reinit",
      file: "reinit",
      description:
        "A comma-separated list of modules to reinitialize before starting the server",
      isBoolean: false,
      value: "",
      messageKey: "load-available-modules",
    },
    {
      title: "Addons Path",
      cli: "--addons-path",
      file: "addons_path",
      description:
        "Comma-separated list of directories in which modules are stored",
      isBoolean: false,
      value: "",
    },
    {
      title: "Upgrade Path",
      cli: "--upgrade-path",
      file: "upgrade_path",
      description:
        "Comma-separated list of directories from which additional upgrade scripts are loaded.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Pre-upgrade Script",
      cli: "--pre-upgrade-script",
      file: "pre_upgrade_script",
      description: "Comma-separated list of paths to upgrade scripts.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Load Modules",
      cli: "--load",
      file: "load",
      description: "list of server-wide modules to load.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Data Directory",
      cli: "--data-dir",
      file: "data_dir",
      description:
        "Directory path where to store Odoo data (eg. filestore, sessions).",
      isBoolean: false,
      value: "",
    },
    {
      title: "With Demo Data",
      cli: "--with-demo",
      file: "with_demo",
      description: "Install demo data in new databases.",
      isBoolean: true,
      value: false,
    },
    {
      title: "Without Demo Data",
      cli: "--without-demo",
      file: "without_demo",
      description:
        "Do not install demo data nor in new databases nor when installing new modules in a database.",
      isBoolean: true,
      value: false,
    },
    {
      title: "Skip Auto Install",
      cli: "--skip-auto-install",
      file: "skip_auto_install",
      description:
        "Skips auto-installing modules when a new module installation is requested.",
      isBoolean: true,
      value: false,
    },
    {
      title: "Stop After Init",
      cli: "--stop-after-init",
      file: "stop_after_init",
      description: "Stops the server after its initialization.",
      isBoolean: true,
      value: false,
    },
    {
      title: "GeoIP City Database",
      cli: "--geoip-city-db",
      file: "geoip_city_db",
      description: "Absolute path to the GeoIP City database file.",
      isBoolean: false,
      value: "",
    },
    {
      title: "GeoIP Country Database",
      cli: "--geoip-country-db",
      file: "geoip_country_db",
      description: "Absolute path to the GeoIP Country database file.",
      isBoolean: false,
      value: "",
    },
  ],
  developer: [
    {
      title: "Developer Mode",
      cli: "--dev",
      file: "dev",
      description:
        "Comma-separated list of developer features. For development purposes only. Must not be used in production. Supported values include: all, xml, reload, qweb, werkzeug, replica, access.",
      isBoolean: false,
      value: "xml",
    },
  ],
  testing: [
    {
      title: "Test Enable",
      cli: "--test-enable",
      file: "test_enable",
      description: "Runs tests after module installation.",
      isBoolean: true,
      value: false,
    },
    {
      title: "Test file",
      cli: "--test-file",
      file: "test_file",
      description: "Runs a python test file.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Test tags",
      cli: "--test-tags",
      file: "test_tags",
      description:
        "Comma-separated list of specs to filter which tests to execute. Enable unit tests if set.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Screenshots directory",
      cli: "--screenshots",
      file: "screenshots",
      description:
        "Specify directory where to write screenshots when an HttpCase.browser_js test fails.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Screencasts directory",
      cli: "--screencasts",
      file: "screencasts",
      description:
        "Enable screencasts and specify directory where to write screencasts files.",
      isBoolean: false,
      value: "",
    },
  ],
  http: [
    {
      title: "Disable HTTP",
      cli: "--no-http",
      file: "http_enable",
      description:
        "Do not start the HTTP or long-polling workers (cron workers may still start). Has no effect if --test-enable is set.",
      isBoolean: true,
      value: false,
    },
    {
      title: "HTTP Interface",
      cli: "--http-interface",
      file: "http_interface",
      description:
        "TCP/IP address on which the HTTP server listens. Defaults to 0.0.0.0 (all addresses).",
      isBoolean: false,
      value: "",
    },
    {
      title: "HTTP Port",
      cli: "--http-port",
      file: "http_port",
      description: "Port on which the HTTP server listens. Defaults to 8069.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Gevent Port",
      cli: "--gevent-port",
      file: "gevent_port",
      description:
        "TCP port for websocket connections in multiprocessing or gevent mode. Defaults to 8072. Not used in threaded mode.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Proxy Mode",
      cli: "--proxy-mode",
      file: "proxy_mode",
      description:
        "Enables use of X-Forwarded-* headers when running behind a reverse proxy. Must not be enabled outside a reverse proxy scenario.",
      isBoolean: true,
      value: false,
    },
    {
      title: "X-Sendfile",
      cli: "--x-sendfile",
      file: "x_sendfile",
      description:
        "Delegates serving attachment files to the static web server using X-Sendfile (Apache) and X-Accel-* (Nginx) headers.",
      isBoolean: true,
      value: false,
    },
  ],
  database: [
    {
      title: "Database User",
      cli: "--db-user",
      file: "db_user",
      description: "Database username, used to connect to PostgreSQL.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database Password",
      cli: "--db-password",
      file: "db_password",
      description: "Database password, used to connect to PostgreSQL.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database Host",
      cli: "--db-host",
      file: "db_host",
      description: "Database host, used to connect to PostgreSQL.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database Port",
      cli: "--db-port",
      file: "db_port",
      description: "Database port, used to connect to PostgreSQL.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database replica host",
      cli: "--db-replica-host",
      file: "db_replica_host",
      description:
        "Host for the replica database server, disabled when not set / empty",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database replica port",
      cli: "--db-replica-port",
      file: "db_replica_port",
      description:
        "The port the replica database listens on, defaults to --db_port",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database filter",
      cli: "--db-filter",
      file: "dbfilter",
      description: "Hides databases that do not match <filter> for the Web UI.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Database template",
      cli: "--db-template",
      file: "db_template",
      description:
        "When creating new databases from the database-management screens",
      isBoolean: false,
      value: "",
    },
    {
      title: "Postgre path",
      cli: "--pg-path",
      file: "pg_path",
      description:
        "Path to the PostgreSQL binaries that are used by the database manager to dump and restore databases.",
      isBoolean: false,
      value: "",
    },
    {
      title: "No database list",
      cli: "--no-database-list",
      file: "no_database_list",
      description:
        "Suppresses the ability to list databases available on the system",
      isBoolean: true,
      value: false,
    },
    {
      title: "Database SSL mode",
      cli: "--db-ssl-mode",
      file: "db_ssl_mode",
      description:
        "Control the SSL security of the connection between Odoo and PostgreSQL. Value should be one of 'disable', 'allow', 'prefer', 'require', 'verify-ca' or 'verify-full' Default value is 'prefer'.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Unaccent extension",
      cli: "--unaccent",
      file: "unaccent",
      description:
        "Try to enable the unaccent extension when creating new databases",
      isBoolean: true,
      value: false,
    },
  ],
  emails: [
    {
      title: "Email From",
      cli: "--email-from",
      file: "email_from",
      description:
        "Email address used as <FROM> when Odoo needs to send mails.",
      isBoolean: false,
      value: "",
    },
    {
      title: "From Filter",
      cli: "--from-filter",
      file: "from_filter",
      description:
        "Define which email address or domain the SMTP configuration applies to. If the sender does not match, Odoo will fallback to mail.default.from and mail.catchall.domain.",
      isBoolean: false,
      value: "",
    },
    {
      title: "SMTP Server",
      cli: "--smtp",
      file: "smtp_server",
      description: "Address of the SMTP server used to send emails.",
      isBoolean: false,
      value: "",
    },
    {
      title: "SMTP Port",
      cli: "--smtp-port",
      file: "smtp_port",
      description: "Port of the SMTP server.",
      isBoolean: false,
      value: "",
    },
    {
      title: "SMTP SSL",
      cli: "--smtp-ssl",
      file: "smtp_ssl",
      description: "If set, Odoo will use SSL/STARTTLS SMTP connections.",
      isBoolean: true,
      value: false,
    },
    {
      title: "SMTP Username",
      cli: "--smtp-user",
      file: "smtp_user",
      description: "Username used to authenticate with the SMTP server.",
      isBoolean: false,
      value: "",
    },
    {
      title: "SMTP Password",
      cli: "--smtp-password",
      file: "smtp_password",
      description: "Password used to authenticate with the SMTP server.",
      isBoolean: false,
      value: "",
    },
    {
      title: "SMTP SSL Certificate",
      cli: "--smtp-ssl-certificate-filename",
      file: "smtp_ssl_certificate",
      description:
        "Path to the SSL certificate file used for SMTP authentication. Requires an SSL private key.",
      isBoolean: false,
      value: "",
    },
    {
      title: "SMTP SSL Private Key",
      cli: "--smtp-ssl-private-key-filename",
      file: "smtp_ssl_private_key",
      description:
        "Path to the SSL private key file used for SMTP authentication. Requires an SSL certificate.",
      isBoolean: false,
      value: "",
    },
  ],
  internationalisation: [
    {
      title: "Load Languages",
      cli: "--load-language",
      file: "load_language",
      description:
        "Specifies the languages (comma-separated) for the translations you want to be loaded.",
      isBoolean: false,
      value: "",
    },
    {
      title: "I18n Overwrite",
      cli: "--i18n-overwrite",
      file: "i18n_overwrite",
      description:
        "Overwrites existing translation terms when updating a module or importing a CSV or PO file.",
      isBoolean: true,
      value: false,
    },
  ],
  logging: [
    {
      title: "Log File",
      cli: "--logfile",
      file: "logfile",
      description:
        "Sends logging output to the specified file instead of stderr. On Unix systems, the file can be managed by external log rotation tools and will be automatically reopened when replaced.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Syslog",
      cli: "--syslog",
      file: "syslog",
      description:
        "Logs to the system event logger (syslog on Unix systems, Event Log on Windows). This destination is not configurable.",
      isBoolean: true,
      value: false,
    },
    {
      title: "Log Database",
      cli: "--log-db",
      file: "log_db",
      description:
        "Logs to the ir.logging table of the specified database. Can be a database name or a PostgreSQL URI.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Log Handler",
      cli: "--log-handler",
      file: "log_handler",
      description:
        "Configures logging levels per logger using {LOGGER}:{LEVEL}. Can be repeated to configure multiple loggers. If LOGGER is omitted, configures the root logger. Default level is INFO.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Log Web",
      cli: "--log-web",
      file: "log_web",
      description:
        "Enables DEBUG logging of HTTP requests and responses (equivalent to --log-handler=odoo.http:DEBUG).",
      isBoolean: true,
      value: false,
    },
    {
      title: "Log SQL",
      cli: "--log-sql",
      file: "log_sql",
      description:
        "Enables DEBUG logging of SQL queries (equivalent to --log-handler=odoo.sql_db:DEBUG).",
      isBoolean: true,
      value: false,
    },
    {
      title: "Log Level",
      cli: "--log-level",
      file: "log_level",
      description:
        "Shortcut to set predefined logging levels on specific loggers. Supports real levels (critical, error, warn, debug) and debugging pseudo-levels such as debug_sql, debug_rpc, and debug_rpc_answer.",
      isBoolean: false,
      value: "",
    },
  ],
  multiprocessing: [
    {
      title: "Workers",
      cli: "--workers",
      file: "workers",
      description:
        "Enables multiprocessing and sets the number of HTTP worker processes handling HTTP and RPC requests. Only available on Unix-based systems.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Limit Requests",
      cli: "--limit-request",
      file: "limit_request",
      description:
        "Number of requests a worker will process before being recycled and restarted. Defaults to 8196.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Soft Memory Limit",
      cli: "--limit-memory-soft",
      file: "limit_memory_soft",
      description:
        "Maximum allowed virtual memory per worker in bytes. If exceeded, the worker is recycled after the current request. Defaults to 2048 MiB.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Hard Memory Limit",
      cli: "--limit-memory-hard",
      file: "limit_memory_hard",
      description:
        "Hard limit on virtual memory per worker in bytes. Workers exceeding this limit are immediately killed. Defaults to 2560 MiB.",
      isBoolean: false,
      value: "",
    },
    {
      title: "CPU Time Limit",
      cli: "--limit-time-cpu",
      file: "limit_time_cpu",
      description:
        "Maximum CPU time (in seconds) a worker may use per request before being killed. Defaults to 60.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Real Time Limit",
      cli: "--limit-time-real",
      file: "limit_time_real",
      description:
        "Maximum wall-clock time (in seconds) to process a request, including external operations such as SQL queries. Defaults to 120.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Max Cron Threads",
      cli: "--max-cron-threads",
      file: "max_cron_threads",
      description:
        "Number of workers dedicated to cron jobs. Defaults to 2. Uses threads in multi-thread mode and processes in multi-processing mode.",
      isBoolean: false,
      value: "",
    },
    {
      title: "Cron Worker Time Limit",
      cli: "--limit-time-worker-cron",
      file: "limit_time_worker_cron",
      description:
        "Soft limit (in seconds) for how long a cron worker or thread may live before being restarted. Set to 0 to disable. Defaults to 0.",
      isBoolean: false,
      value: "",
    },
  ],
};
