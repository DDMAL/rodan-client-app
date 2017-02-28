import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';

/**
 * Password view.
 */
export default class ViewPassword extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        var passwordError = this._checkPassword();
        if (passwordError)
        {
            this.ui.textmessage.text(passwordError);
        }
        else
        {
            rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__USER_CHANGE_PASSWORD, {newpassword: this.ui.textPassword.val(),
                                                                                        currentpassword: this.ui.textPasswordCurrent.val()});  
        }
    }

    /**
     * Checks password fields. Will provide error text if passwords no good, else null.
     */
    _checkPassword()
    {
        var password = this.ui.textPassword.val();
        var confirm = this.ui.textPasswordConfirm.val();
        if (!password)
        {
            return 'Your password cannot be empty. Come on, you must have done this before.';
        }
        else if (password !== confirm)
        {
            return 'Passwords do not match.';
        }
        return null;
    }
}
ViewPassword.prototype.modelEvents = {
            'all': 'render'
        };
ViewPassword.prototype.ui = {
            buttonSave: '#button-save_password',
            textPassword: '#text-password',
            textPasswordConfirm: '#text-password_confirm',
            textmessage: '#text-message',
            textPasswordCurrent: '#text-password_current'
        };
ViewPassword.prototype.events = {
            'click @ui.buttonSave': '_handleButtonSave'
        };
ViewPassword.prototype.template = '#template-main_user_password';
