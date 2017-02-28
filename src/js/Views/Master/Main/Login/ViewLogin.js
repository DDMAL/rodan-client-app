import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';

/**
 * Login view.
 */
export default class ViewLogin extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__UPDATER_CLEAR);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle login button.
     */
    _handleButton()
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__AUTHENTICATION_LOGIN, {username: this.ui.textUsername.val(), password: this.ui.textPassword.val()}); 
    }
}
ViewLogin.prototype.modelEvents = {
    'all': 'render'
};
ViewLogin.prototype.ui = {
    textUsername: '#text-login_username',
    textPassword: '#text-login_password',
    buttonLogin: '#button-login'
};
ViewLogin.prototype.events = {
    'click @ui.buttonLogin': '_handleButton'
};
ViewLogin.prototype.template = '#template-main_login';