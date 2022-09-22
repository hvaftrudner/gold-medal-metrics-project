var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  const countryTable = 'CREATE TABLE Country(\
    name TEXT NOT NULL, \
    code TEXT NOT NULL, \
    gdp INTEGER, \
    population INTEGER);'
  return countryTable;
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  const goldMedalTable = 'CREATE TABLE GoldMedal( \
    id INTEGER UNIQUE, \
    year INTEGER NOT NULL, \
    city TEXT NOT NULL, \
    season TEXT NOT NULL, \
    name TEXT NOT NULL, \
    country TEXT NOT NULL, \
    gender TEXT NOT NULL, \
    sport TEXT NOT NULL, \
    discipline TEXT NOT NULL, \
    event TEXT NOT NULL);'
  return goldMedalTable;
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
    // remember '' around search clause
    const count = `SELECT COUNT(*) AS count FROM GoldMedal WHERE country = '${country}';`;
    return count;
  
};


const seasonWins = (season, country) => {
  
  if (['Summer', 'Winter'].includes(season)) {
    return `SELECT year, COUNT(*) AS count FROM GoldMedal WHERE country = '${country}' AND season = '${season}' GROUP BY year ORDER BY COUNT(*) DESC LIMIT 1;`;
  }
  return null;
}

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
  return seasonWins('Summer', country);
};


/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  return seasonWins('Winter', country);
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/
const best = (best, country) => {
  if(['year', 'discipline', 'sport', 'event'].includes(best)){
    return `SELECT ${best}, COUNT(*) AS count FROM GoldMedal WHERE country = '${country}' GROUP BY ${best} ORDER BY COUNT(*) DESC LIMIT 1;`;
  }
  return null;
}

const bestYear = country => {
  return best('year', country);
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  return best('discipline', country);
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  return best('sport', country);
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  return best('event', country);
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const gender = (gender, country) => {
  if(['Men', 'Women'].includes(gender)){
    return `SELECT COUNT(DISTINCT name) FROM GoldMedal WHERE country = '${country}' AND gender = '${gender}';`;
  }
  return null;
};


const numberMenMedalists = country => {
  return gender('Men', country);
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  return gender('Women', country);
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  return `SELECT name FROM GoldMedal WHERE country = '${country}' ORDER BY name DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  let sort = '';
  if(field){
    if(sortAscending){
      sort = `ORDER BY ${field} ASC`;
    } else {
      sort = `ORDER BY ${field} DESC`;
    };
  };
    const ordered = `SELECT * FROM GoldMedal WHERE country = '${country}' ${sort};`;
    return ordered;
  
};



/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  let sort = '';
  if(field){
    if(sortAscending){
      sort = `ORDER BY ${field} ASC`;
    } else {
      sort = `ORDER BY ${field} DESC`;
    };
  };

  const ordered =  `SELECT sport, COUNT(sport) AS count, \
  (COUNT(sport) * 100 / (select COUNT(*) FROM GoldMedal\
  WHERE country = '${country}')) AS percent FROM GoldMedal WHERE country = '${country}'\
  GROUP BY sport ${sort};`;
  return ordered;
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
