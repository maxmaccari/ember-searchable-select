import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('searchable-select', 'Integration | Component | searchable select', {
  integration: true
});

var TEDevents = Ember.A([
  {
   id: 1,
   title: 'TED2015',
   longTitle: 'TED2015: Truth and Dare',
   keywords: ''
  },
  {
    id: 2,
    title: 'TEDxNASA',
    keywords: '',
    isTEDxEvent: true
  },
  {
   id: 3,
   title: 'TED2014',
   keywords: ''
  },
  {
    id: 4,
    title: 'TEDGlobal 2014',
    keywords: ''
  },
  {
    id: 5,
    title: 'TEDxNewYork',
    keywords: 'NYC',
    isTEDxEvent: true
  },
  {
    id: 6,
    title: 'TEDGlobal 2013',
    keywords: ''
  },
  {
    id: 7,
    title: 'TED2013',
    keywords: ''
  }
]);

test('it renders a label with a default prompt', function(assert) {
  assert.expect(2);

  this.render(hbs`{{searchable-select}}`);

  assert.equal(this.$('.Searchable-select__label').length, 1);
  assert.equal(this.$('.Searchable-select__label').text().trim(), 'Select an option');
});

test('can configure the label prompt with custom text', function(assert) {
  assert.expect(1);

  this.render(hbs`{{searchable-select prompt="custom text"}}`);
  assert.equal(this.$('.Searchable-select__label').text().trim(), 'custom text');
});

test('clicking the label opens a search input and list of all options', function(assert) {
  assert.expect(6);

  this.set('content', TEDevents);
  this.render(hbs`{{searchable-select content=content}}`);
  var $component = this.$();

  $component.find('.Searchable-select__label').click();
  var $searchInput = $component.find('.Searchable-select__input');
  var $options = $component.find('.Searchable-select__option');

  assert.equal($component.find('.Searchable-select__menu').length, 1);
  assert.equal($searchInput.length, 1);
  assert.equal($options.length, 7);

  assert.equal($searchInput.attr('placeholder').trim(), 'Type to search',
    'the search input should have a default prompt message');

  assert.equal($options.eq(0).text().trim(), 'TED2015',
    'item labels should default to "title" value');

  assert.equal($options.is('.Searchable-select__option--selected'), false,
    'no options should be selected by default');
});

test('can change the search prompt to a new string', function(assert) {
  assert.expect(1);
  this.set('searchPrompt', 'type to search events');

  this.render(hbs`{{searchable-select searchPrompt=searchPrompt}}`);
  var $component = this.$();
  $component.find('.Searchable-select__label').click();

  assert.equal(this.$('.Searchable-select__input').attr('placeholder').trim(), 'type to search events');
});

test('can specify an alternate path for option label', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);
  this.set('optionLabelKey', 'longTitle');

  this.render(hbs`{{searchable-select content=content optionLabelKey=optionLabelKey}}`);
  var $component = this.$();
  $component.find('.Searchable-select__label').click();

  assert.equal($component.find('.Searchable-select__option').eq(0).text().trim(), 'TED2015: Truth and Dare');
});

test('can pass in an initial selection', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);
  this.set('selected', TEDevents.findBy('id', 3));

  this.render(hbs`{{searchable-select content=content selected=selected}}`);
  this.$('.Searchable-select__label').click();

  var $selected = this.$('.Searchable-select__option-label--selected');
  assert.equal($selected.text().trim(), 'TED2014');
});

test('can sort the options by a provided key', function(assert) {
  assert.expect(3);
  this.set('content', TEDevents);
  this.set('sortBy', 'title');

  this.render(hbs`{{searchable-select content=content sortBy=sortBy}}`);
  this.$('.Searchable-select__label').click();

  var $options = this.$('.Searchable-select__option');

  assert.equal($options.eq(0).text().trim(), 'TED2013');
  assert.equal($options.eq(1).text().trim(), 'TED2014');
  assert.equal($options.eq(2).text().trim(), 'TED2015');
});

test('can type to refine the list of options', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);

  this.render(hbs`{{searchable-select content=content}}`);
  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__input').val('2013').keyup();

  assert.equal(this.$('.Searchable-select__option').length, 2);
});

test('can restrict the search to only search on word boundaries', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);

  this.render(hbs`{{searchable-select content=content limitSearchToWordBoundary=true}}`);
  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__input').val('2013').keyup();

  assert.equal(this.$('.Searchable-select__option').length, 1);
});

test('selection gets passed out with the on-change action', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);

  var itemToSelect = TEDevents.findBy('title', 'TEDGlobal 2014');

  this.actions = { assertChanged: function(selection) {
    assert.deepEqual(selection, itemToSelect);
  }};

  this.render(hbs`{{searchable-select content=content on-change=(action "assertChanged")}}`);
  this.$('.Searchable-select__label').click();

  this.$('.Searchable-select__option:contains("TEDGlobal 2014")').click();
});

test('search text gets passed out with the on-search action', function(assert) {
  assert.expect(2);
  this.set('content', TEDevents);

  this.actions = { assertSearched: function(searchText) {
    assert.equal(searchText, 'global');
    assert.equal(this.$('.Searchable-select__option').length, 7,
      'automatic filtering should be disabled when an on-search action is used');
  }};

  this.render(hbs`{{searchable-select content=content on-search=(action "assertSearched")}}`);
  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__input').val('global').keyup();

});



// test('can specify a path for a disabled flag', function(assert) {
//   assert.expect(1);
//   this.set('content', TEDevents);
//   this.set('optionDisabledKey', 'isNotSpokenInCanada');

//   this.render(hbs`{{searchable-select content=content optionDisabledKey=optionDisabledKey}}`);

//   var $options = this.$('option:not(.Searchable-select__prompt)');

//   assert.equal($options.filter(':disabled').length, 1);
// });

// test('multiple selection gets passed out as an array;', function(assert) {
//   assert.expect(1);
//   this.set('content', TEDevents);

//   this.actions = { assertChanged: function(selection) {
//     assert.deepEqual(selection, itemsToSelect);
//   }};

//   var itemsToSelect = options.rejectBy('code', 'en');

//   this.render(hbs`{{searchable-select content=content multiple=true on-change=(action "assertChanged")}}`);

//   this.$('select').val([1,2]);
//   this.$('select').trigger('change');

// });

// test('can create a two way binding on the selection', function(assert) {
//   assert.expect(1);

//   this.set('content', TEDevents);
//   this.set('selection', null);
//   var itemToSelect = options.findBy('id', 2);

//   this.render(hbs`{{searchable-select content=content on-change=(action (mut selection))}}`);

//   this.$('select').val(2);
//   this.$('select').trigger('change');

//   assert.equal(this.get('selection'), itemToSelect);

// });

// test('can force the select to reset after a change is made', function(assert) {
//   assert.expect(1);
//   this.set('content', TEDevents);

//   this.render(hbs`{{searchable-select content=content resetOnChange=true}}`);

//   this.$('select').val(1);
//   this.$('select').trigger('change');

//   assert.equal(this.$('.Searchable-select__prompt:selected').length, 1);
// });

// test('can add a custom class name to the select element', function(assert) {
//   assert.expect(1);

//   this.render(hbs`{{searchable-select content=content selectClassNames="my-select"}}`);

//   assert.equal(this.$('select.my-select').length, 1);
// });
