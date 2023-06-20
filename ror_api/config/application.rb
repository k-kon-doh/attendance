require_relative 'boot'

# require 'rails/all'
require 'rails'
require 'active_record/railtie'
## require "active_storage/engine"
require 'action_controller/railtie'
require 'action_view/railtie'
require 'action_mailer/railtie'
require 'active_job/railtie'
require 'action_cable/engine'
## require "action_mailbox/engine"
## require "action_text/engine"
## require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module AttApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.

    config.api_only = true

    config.settings = config_for(:settings)

    config.middleware.use ActionDispatch::Flash
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CacheStore
    config.middleware.use ActionDispatch::ContentSecurityPolicy::Middleware

    config.autoload_paths << Rails.root.join('lib')
    config.autoload_paths << Rails.root.join('app/resources')
    config.time_zone = 'Tokyo'

    config.active_record.schema_format = :sql
    config.active_record.default_timezone = :local

    config.active_record.sqlite3_production_warning = false
  end
end
