import Events from 'js/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';
import ViewLogin from './Login/ViewLogin';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
export default class LayoutViewMain extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     */
    initialize()
    {
        this.addRegions({
            region: 'div'
        });
        this._initializeRadio();
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').reply(Events.REQUEST__MAINREGION_SHOW_VIEW, options => this._handleCommandShow(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleDeauthenticationSuccess());
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__AUTHENTICATION_LOGINREQUIRED, () => this._handleAuthenticationLoginRequired());
    }

    /**
     * Handles request for login.
     */
    _handleAuthenticationLoginRequired()
    {
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: new ViewLogin()});
    }

    /**
     * Handle show.
     */
    _handleCommandShow(options)
    {
        /** @ignore */
        this.region.show(options.view);
    }

    /**
     * Handle deauthentication success.
     */
    _handleDeauthenticationSuccess()
    {
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: new ViewLogin()});
    }
}
LayoutViewMain.prototype.template = '#template-empty';