require('../test_helper');
require('../../meta/helpers');

describe('Meta helpers', () => {
  describe('#radio', () => {
    it('should generate a radio input with a label', () => {
      var output = Handlebars.helpers.radio('foo', 'bar', 'baz', 'local');

      assert(output instanceof Handlebars.SafeString);
      assert.include(output, '<input type="radio" name="bar" id="foo" value="foo">');
      assert.include(output, '<label for="foo">baz</label>');
    });

    it('should look for a translation key based on the given label', () => {
      I18n.cache = {meta: {configuration: {foo: 'bar'}}};

      var output = Handlebars.helpers.radio('', '', 'foo', 'meta');

      assert.include(output, '<label>bar</label>');
    });

    it('should set the checked attribute if the element is set in the config', () => {
      // We assume that the default locale is 'en' here
      // so (Config.meta.locale == 'en') == true.
      var output = Handlebars.helpers.radio('en', 'locale', '', 'meta');

      assert.include(output, 'checked="true"');
    });
  });

  describe('#input', () => {
    it('should generate an text input', () => {
      var output = Handlebars.helpers.input('foo', 'meta');

      assert(output instanceof Handlebars.SafeString);
      assert.include(output, '<input type="text"');
    });

    it('should generate the field\'s name and id based on the given id and section', () => {
      var output = Handlebars.helpers.input('foo', 'meta');

      assert.include(output, 'name="meta_foo"');
      assert.include(output, 'id="meta_foo"');
    });

    it('should read the value from the configuration', () => {
      var output = Handlebars.helpers.input('locale', 'meta');

      assert.include(output, 'value="en"');
    });
  });
});
