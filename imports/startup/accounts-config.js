import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating'

import './registration-templates.html'

Template.birthdayInput.rendered = function() {
  this.$('input').datepicker()
};

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
})

AccountsTemplates.addFields([
    {
        _id: 'name',
        type: 'text',
        displayName: 'Nombre',
        placeholder: 'Nombre',
        required: true
    },
    {
        _id: 'birth_date',
        type: 'text',
        displayName: 'Fecha de Nacimiento',
        template: 'birthdayInput',
        placeholder: 'Fecha de Nacimiento',
        required: true
    },
    {
        _id: 'address',
        type: 'text',
        displayName: 'Dirección',
        placeholder: 'Dirección',
        required: true
    },
    {
        _id: 'blood_type',
        type: 'select',
        displayName: 'Tipo de sangre',
        select: [
          {
            text: 'A',
            value: 'A'
          },
          {
            text: 'B',
            value: 'B'
          },
          {
            text: 'AB',
            value: 'AB'
          },
          {
            text: 'O',
            value: 'O'
          },
        ],
        required: true
    },
    {
        _id: 'card_number',
        type: 'text',
        displayName: 'Numero de tarjeta de credito',
        placeholder: '523432-42352-1983',
        required: true
    },
    {
        _id: 'card_cvv',
        type: 'text',
        displayName: 'CVV Tarjeta de credito',
        placeholder: '555',
        required: true
    },
    {
        _id: 'card_holder_first_name',
        type: 'text',
        displayName: 'Primer nombre tarjeta de credito',
        placeholder: 'Nombre',
        required: true
    },
    {
        _id: 'card_holder_last_name',
        type: 'text',
        displayName: 'Apellido tarjeta de credito',
        placeholder: 'Apellido',
        required: true
    }
])

T9n.setLanguage('es')
