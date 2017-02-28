import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import Events from 'js/Events';
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewNavigationNodeRoot from './ViewNavigationNodeRoot';
import ViewResourceTypeDetailCollectionItem from 'js/Views/Master/Main/ResourceType/ViewResourceTypeDetailCollectionItem';
import ViewUser from 'js/Views/Master/Main/User/Individual/ViewUser';

/**
 * Layout view for main work area. This is responsible for loading views within the main region.
 */
export default class LayoutViewNavigation extends Marionette.LayoutView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
        this._initializeRadio();
        this.addRegions({
            regionNavigationTree: '#region-navigation_tree'
        });
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__AUTHENTICATION_LOGIN_SUCCESS, options => this._handleAuthenticationSuccess(options));
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__AUTHENTICATION_LOGOUT_SUCCESS, () => this._handleDeauthenticationSuccess());
        Radio.channel('rodan').reply(Events.REQUEST__SHOW_ABOUT, () => this._handleRequestShowAbout());
        Radio.channel('rodan').reply(Events.REQUEST__SHOW_HELP, () => this._handleRequestShowHelp());
        Radio.channel('rodan').reply(Events.REQUEST__SHOW_API, () => this._handleRequestShowAPI());
    }

    /**
     * Handle authentication.
     */
    _handleAuthenticationSuccess()
    {
        var model = new Backbone.Model({name: 'Projects'});
        var object = {model: model, collection: RodanClientCore.channel.request(RodanClientCore.events.REQUEST__GLOBAL_PROJECT_COLLECTION)};
        this.regionNavigationTree.show(new ViewNavigationNodeRoot(object)); 
        this.$el.find('#button-navigation_logout').prop('disabled', false);
        this.$el.find('#button-navigation_preferences').prop('disabled', false);
    }

    /**
     * Handle deauthentication.
     */
    _handleDeauthenticationSuccess()
    {
        this.regionNavigationTree.empty(); 
        this.$el.find('#button-navigation_logout').prop('disabled', true);
        this.$el.find('#button-navigation_preferences').prop('disabled', true);
    }

    /**
     * Handle button logout.
     */
    _handleButtonLogout()
    {
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__AUTHENTICATION_LOGOUT);
    }

    /**
     * Handle button about.
     */
    _handleButtonAbout()
    {
        Radio.channel('rodan').request(Events.REQUEST__SHOW_ABOUT);
    }

    /**
     * Handle button help.
     */
    _handleButtonHelp()
    {
        Radio.channel('rodan').request(Events.REQUEST__SHOW_HELP);
    }

    /**
     * Handle button preferences.
     */
    _handleButtonPreferences()
    {
        var user = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__AUTHENTICATION_USER);
        var view = new ViewUser({model: user});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {title: user.get('username'), content: view});
    }

    /**
     * Handle button dev.
     */
    _handleButtonDev()
    {
        Radio.channel('rodan').request(Events.REQUEST__SHOW_API);
    }

    /**
     * Handle request show about.
     */
    _handleRequestShowAbout()
    {
        var serverConfig = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__SERVER_CONFIGURATION);
        var hostname = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__SERVER_GET_HOSTNAME);
        var version = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__SERVER_GET_VERSION);
        var serverDate = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__SERVER_DATE);
        serverDate = serverDate ? serverDate.toString() : 'unknown';
        var html = _.template($('#template-misc_about').html())({hostname: hostname,
                                                                 version: version,
                                                                 serverConfiguration: serverConfig,
                                                                 date: serverDate,
                                                                 client: RodanClientCore.config.CLIENT});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {title: 'About', content: html});
    }

    /**
     * Handle request show help.
     */
    _handleRequestShowHelp()
    {
        var html = _.template($('#template-misc_help').html())({email: RodanClientCore.config.ADMIN_CLIENT.EMAIL, name: RodanClientCore.config.ADMIN_CLIENT.NAME, url: RodanClientCore.config.WEBSITE_URL});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {title: 'Help', content: html});
    }

    /**
     * Handle request show API.
     */
    _handleRequestShowAPI()
    {
        var collection = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
        var view = new BaseViewCollection({collection: collection,
                                           template: '#template-resourcetype_collection',
                                           childView: ViewResourceTypeDetailCollectionItem});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {title: 'Development', content: view});
    }
}
LayoutViewNavigation.prototype.template = '#template-navigation';
LayoutViewNavigation.prototype.ui = {
    buttonLogout: '#button-navigation_logout',
    buttonAbout: '#button-navigation_about',
    buttonHelp: '#button-navigation_help',
    buttonPreferences: '#button-navigation_preferences',
    buttonDev: '#button-navigation_dev'
};
LayoutViewNavigation.prototype.events = {
    'click @ui.buttonLogout': '_handleButtonLogout',
    'click @ui.buttonAbout': '_handleButtonAbout',
    'click @ui.buttonHelp': '_handleButtonHelp',
    'click @ui.buttonPreferences': '_handleButtonPreferences',
    'click @ui.buttonDev': '_handleButtonDev'
};
