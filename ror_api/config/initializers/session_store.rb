# secure 属性付与
Rails.application.config.session_store(secure: Rails.env.production?)
