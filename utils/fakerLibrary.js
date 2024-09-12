const { faker } = require('@faker-js/faker');

const generateFirstName = () => faker.person.firstName();
const generateLastName = () => faker.person.lastName();
const generateEmail = () => `${Math.floor(Math.random() * 100000000)}-${faker.internet.email()}`;
const generateBirthDate = () => faker.date.birthdate({ min: 1930, max: 1999, mode: 'year' }).toLocaleDateString('en-GB');
const generateFutureDate = () => faker.date.future().toLocaleDateString('en-GB');
const generateGender = () => faker.helpers.arrayElement(['male', 'female', 'other']);
const generateCountryCode = () => faker.helpers.arrayElement(['BE', 'NL', 'FR', 'DE', 'ES', 'GB']);
const generateRelation = () => faker.helpers.arrayElement(['family', 'friend']);
const generateFolderName = () => faker.lorem.words(2);
const generateDefaultFolderName = () => faker.lorem.words(2);
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const generateTeamName = () => faker.commerce.department();

module.exports = {
  generateFirstName,
  generateLastName,
  generateEmail,
  generateBirthDate,
  generateFutureDate,
  generateGender,
  generateCountryCode,
  generateRelation,
  generateFolderName,
  generateDefaultFolderName,
  generateRandomNumber,
  generateTeamName
};