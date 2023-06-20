if Rails.env.development? && !Rails.application.config.cache_classes
  Rails.autoloaders.main.on_setup do
    Rails.cache.clear
  end
end
