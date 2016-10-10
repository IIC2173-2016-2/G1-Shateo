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
        _id: 'credit_card',
        type: 'text',
        displayName: 'Tarjeta de credito',
        placeholder: 'XXXXXXXX-XX',
        required: true,
        uppercase: true
    }
])

T9n.setLanguage('es')
