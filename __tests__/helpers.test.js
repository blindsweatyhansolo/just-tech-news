const {format_date, format_plural, format_url} = require('../utils/helpers');

// test for date format
test('format_date() returns a date string', () => {
    const date = new Date('2022-05-18 16:12:03');

    expect(format_date(date)).toBe('5/18/2022');
});

// test for pluralization of 'point' and 'comment'
test('format_plural() returns plural string', () => {
    const word1 = format_plural('tiger', 1);
    const word2 = format_plural('lion', 2);

    expect(word1).toBe('tiger');
    expect(word2).toBe('lions');
});

// test to shorten URL strings
test('format_url() returns simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});