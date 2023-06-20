module JsonExt
  refine JSON.singleton_class do
    def try_parse(source, opts = {})
      JSON.parse(source, opts)
    rescue JSON::ParserError, TypeError
      nil
    end
  end
end
