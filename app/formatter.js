'use strict';

module.exports = class Formatter {
  /**
   * Converts the given number of seconds to a human readable
   * string like "hours:minutes:seconds".
   *
   * If given a string, consider that we are dealing with a
   * YouTube duration in the ISO 8601 format.
   *
   * @param  {Number} duration - The number of seconds.
   * @return {String}
   */
  static time(duration) {
    if (typeof duration == 'string') {
      // Special case when there's no seconds, our trick with
      // the reversed array won't work.
      if (duration.indexOf("M") != -1 && duration.indexOf("S") == -1)
        duration = duration + "0S";

      var components = duration.split(/PT|H|M|S/);
          components = components.filter((c) => { if (c) return c; });
          components = components.reverse();

      var hours   = parseInt(components[2] || 0);
      var minutes = parseInt(components[1] || 0);
      var seconds = parseInt(components[0]);
    } else {
      var hours   = Math.trunc(duration / 3600);
      var minutes = Math.trunc(duration / 60) - (hours * 60);
      var seconds = Math.trunc(duration % 60);
    }

    if (seconds < 10)
      seconds = "0" + seconds;

    if (hours > 0 && minutes < 10)
      minutes = "0" + minutes;

    if (hours == 0)
      return minutes + ":" + seconds;
    else
      return hours + ":" + minutes + ":" + seconds;
  }

  /**
   * Returns a duration in seconds for a given human time.
   * For instance:
   *
   *   duration("2:30") // => 150
   *
   * @param  {String} human_time - A duration in the HH:MM:SS format.
   * @return {Number}
   */
  static duration(human_time) {
    var components = human_time.split(":");
        components = components.reverse();

    var hours   = parseInt(components[2] || 0) * 3600;
    var minutes = parseInt(components[1] || 0) * 60;
    var seconds = parseInt(components[0]);

    return hours + minutes + seconds;
  }

  /**
   * Returns a human readable sentence to represent the
   * elapsed time since the given timestamp.
   *
   * @param  {Number} timestamp
   * @return {String}
   */
  static relativeTime(timestamp) {
    var diff = this.currentTimestamp() - timestamp;

    if (diff < 60)
      return I18n.t('meta.timing.seconds_ago', {
        number: diff
      });
    else if (diff >= 60 && diff < 3600)
      return I18n.t('meta.timing.minutes_ago', {
        number: Math.trunc(diff / 60)
      });
    else if (diff >= 3600 && diff < (3600 * 24))
      return I18n.t('meta.timing.hours_ago', {
        number: Math.trunc(diff / 3600)
      });
    else if (diff >= (3600 * 24) && diff < (3600 * 24 * 30))
      return I18n.t('meta.timing.days_ago', {
        number: Math.trunc(diff / (3600 * 24))
      });
    else
      return I18n.t('meta.timing.months_ago', {
        number: Math.trunc(diff / (3600 * 24 * 30))
      });
  }

  /**
   * Get the current timestamp in seconds.
   *
   * @return {Number}
   */
  static currentTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Returns artist name based upon the media's title
   * and associated account.
   *
   *   artist('Maliblue', 'Darius')
   *   // => 'Darius'
   *   artist('Kartell - Aura',: 'RocheMusique')
   *   // => 'Kartell'
   *   artist('Talk Talk (Moon Boots Remix)', 'future classic')
   *   // => 'Moon Boots'
   *   artist('Take Care of You', 'Cherokee (Official)')
   *   // => 'Cherokee'
   *
   * @param  {String} title   - The media's title.
   * @param  {String} account - The associated account.
   * @return {String}
   */
  static artist(title, account) {
    if (title.match(/remix/i))
      var artist = title.match(/\((\w|\s)+ remix\)/i)[0]
                        .split(/\(|remix\)/i)[1];
    else if (title.indexOf("-") != -1)
      var artist = title.split(" - ")[0];
    else
      var artist = account.replace(/\s\(Official\)/, "");

    return artist.trim();
  }

  /**
   * Returns the exact file's path to store a
   * file that's going to be downloaded based on
   * the title, the artist and the service.
   *
   * @param  {String}  title     - The media's title.
   * @param  {String}  artist    - The media's artist.
   * @param  {String}  service   - The download service.
   * @param  {String=} extension - The file's extension.
   * @return {String}
   */
  static path(title, artist, service, extension) {
    var folder    = Config.read(service, 'download');
    var file_name = title + (extension || ".mp3");

    // Include the artist if there's none already
    // specified (i.e. if there's no '-').
    if (title.indexOf(' - ') == -1 && service == 'soundcloud')
      file_name = artist + ' - ' + file_name;

    return Paths.join(folder, file_name);
  }
}
