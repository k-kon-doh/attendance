require 'db_initializer'

namespace :db do
  desc 'Clear and Loads initial data'
  task init: :environment do
    DbInitializer.init
  end
end
