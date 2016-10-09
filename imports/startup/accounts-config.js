import { Accounts } from 'meteor/accounts-base'

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
})

AccountsTemplates.addFields([
    {
        _id: 'phone',
        type: 'tel',
        displayName: "Landline Number",
    },
    {
        _id: 'fax',
        type: 'tel',
        displayName: "Fax Number",
    }
])

T9n.setLanguage('es')
