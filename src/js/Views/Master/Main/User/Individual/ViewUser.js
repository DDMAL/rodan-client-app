import $ from 'jquery';
import Events from 'js/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';
import ViewPassword from './ViewPassword';

/**
 * User view.
 */
export default class ViewUser extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the view.
     */
    initialize()
    {
        /** @ignore */
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__USER_PREFERENCE_LOADED, (options) => this._handleUserPreferenceLoaded(options));
    }

    /**
     * On render, update user preferences if available.
     */
    onRender()
    {
        this._renderUserPreference();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle save button.
     */
    _handleButtonSave()
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__USER_SAVE, 
                                  {fields: {first_name: this.ui.textFirstName.val(), 
                                            last_name: this.ui.textLastName.val(), 
                                            email: this.ui.textEmail.val()}});
        if (this._userPreference)
        {
            this._userPreference.set({'send_email': $(this.ui.checkboxSendEmail).prop('checked')});
            rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__USER_PREFERENCE_SAVE, {user_preference: this._userPreference});
        }
    }

    /**
     * Handle change password button.
     */
    _handleButtonChangePassword()
    {
        var view = new ViewPassword();
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {title: 'Change Password', content: view});

    }

    /**
     * Handle user preference loaded.
     */
    _handleUserPreferenceLoaded(options)
    {
        this._renderUserPreference();
    }

    /**
     * Render user preference.
     */
    _renderUserPreference()
    {
        this._userPreference = rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__USER_PREFERENCE);
        if (this._userPreference)
        {
            $(this.ui.divUserPreference).show();
            $(this.ui.divUserPreferenceLoading).hide();
            $(this.ui.checkboxSendEmail).prop('checked', this._userPreference.get('send_email')); 
        }
        else
        {
            $(this.ui.divUserPreference).hide(); 
            $(this.ui.divUserPreferenceLoading).show();
        }
    }
}
ViewUser.prototype.modelEvents = {
            'all': 'render'
        };
ViewUser.prototype.ui = {
            buttonSave: '#button-save_user',
            buttonPassword: '#button-change_password',
            textFirstName: '#text-user_firstname',
            textLastName: '#text-user_lastname',
            textEmail: '#text-user_email',
            checkboxSendEmail: '#checkbox-send_email',
            divUserPreference: '#div-user_preference',
            divUserPreferenceLoading: '#div-user_preference_loading'
        };
ViewUser.prototype.events = {
            'click @ui.buttonSave': '_handleButtonSave',
            'click @ui.buttonPassword': '_handleButtonChangePassword'
        };
ViewUser.prototype.template = '#template-main_user_individual';