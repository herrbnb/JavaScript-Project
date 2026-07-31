const form = document.getElementById('signup-form');

const fields = [
{
 input: document.getElementById('first-name'),
 group: document.getElementById('first-name').closest('.input-group'),
 validate: (value) => value.trim() !== '',
},
{
 input: document.getElementById('last-name'),
 group: document.getElementById('last-name').closest('.input-group'),
 validate: (value) => value.trim() !== '',
},
{
 input: document.getElementById('email'),
 group: document.getElementById('email').closest('.input-group'),
 validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
},
{
 input: document.getElementById('password'),
 group: document.getElementById('password').closest('.input-group'),
 validate: (value) => value.trim() !== '',
}, ];

function validateField(field) {
 const isValid = field.validate(field.input.value);
 field.group.classList.toggle('invalid', !isValid);
 field.input.classList.toggle('invalid', !isValid);
 return isValid;
}

fields.forEach((field) => {
 field.input.addEventListener('blur', () => validateField(field));
 field.input.addEventListener('input', () => {
  if (field.group.classList.contains('invalid')) {
   validateField(field);
  }
 });
});

form.addEventListener('submit', (e) => {
 e.preventDefault();
 const allValid = fields.map(validateField).every(Boolean);
 
 if (allValid) {
  alert('Thanks for signing up! Your free trial has started.');
  form.reset();
  fields.forEach((field) => {
   field.group.classList.remove('invalid');
   field.input.classList.remove('invalid');
  });
 }
});