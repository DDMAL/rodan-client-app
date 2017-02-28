import _ from 'underscore';
import $ from 'jquery';
import BehaviorTable from './Behaviors/BehaviorTable';
import bootstrap from 'bootstrap'; 
import ControllerContextMenu from './Controllers/ControllerContextMenu';
import ControllerModal from './Controllers/ControllerModal';
import ControllerProject from './Controllers/ControllerProject';
import ControllerResource from './Controllers/ControllerResource';
import ControllerRunJob from './Controllers/ControllerRunJob';
import ControllerWorkflow from './Controllers/ControllerWorkflow';
import ControllerWorkflowBuilder from './Controllers/ControllerWorkflowBuilder';
import ControllerWorkflowRun from './Controllers/ControllerWorkflowRun';
import Events from 'js/Events';
import LayoutViewMaster from './Views/Master/LayoutViewMaster';
import Marionette from 'backbone.marionette';
import moment from 'moment';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';

/**
 * Main application class.
 */
export default class Application extends Marionette.Application
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Called on Marionette.Application.start(). This will load the configuration from the host.
     */
    onStart()
    {
        RodanClientCore.setInitFunction(() => this._startUp());
        RodanClientCore.config.load('configuration.json', () => RodanClientCore.initialize());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Application start-up
     */
    _startUp()
    {
        // Check debug.
        if (RodanClientCore.config.DEBUG)
        {
            Radio.tuneIn('rodan');
        }

        this._initializeRadio();
        this._initializeControllers();
        this._initializeBehaviors();
        this._initializeDateTimeFormatter();
        this.addRegions({regionMaster: '#region-master'});
        this._initializeViews();
        require('./.plugins');
    }


    /**
     * Initializes various helpers.
     */
    _initializeDateTimeFormatter()
    {
        moment.defaultFormat = RodanClientCore.config.DATETIME_FORMAT;
        _.formatFromUTC = function(dateTime)
        {
            // TODO - see https://github.com/DDMAL/rodan-client/issues/59
            try
            {
                return moment(dateTime).format();
            }
            catch(error)
            {
                return moment.moment(dateTime).format();
            }
        };
    }

    /**
     * Initialize behaviors.
     */
    _initializeBehaviors()
    {
        Marionette.Behaviors.behaviorsLookup = function()
        {
            return {'Table': BehaviorTable};
        };
    }

    /**
     * Set event binding.
     */
    _initializeRadio()
    {
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__SERVER_ROUTESLOADED, () => this._handleEventRoutesLoaded());
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__AUTHENTICATION_LOGIN_SUCCESS, () => this._handleAuthenticationSuccess());
    }

    /**
     * Initialize controllers. These are not used for viewing; rather, they are server/auth control.
     */
    _initializeControllers()
    {
        this._controllerContextMenu = new ControllerContextMenu();
        this._controllerModal = new ControllerModal();
        this._controllerProject = new ControllerProject();
        this._controllerResource = new ControllerResource();
        this._controllerRunJob = new ControllerRunJob();
        this._controllerWorkflow = new ControllerWorkflow();
        this._controllerWorkflowBuilder = new ControllerWorkflowBuilder();
        this._controllerWorkflowRun = new ControllerWorkflowRun();

    }

    /**
     * Initialize all the views so they can respond to events.
     */
    _initializeViews()
    {
        this._layoutViewMaster = new LayoutViewMaster();
    }

    /**
     * Handle EVENT__SERVER_ROUTESLOADED.
     */
    _handleEventRoutesLoaded()
    {
        // Render layout views.
        /** @ignore */
        this.regionMaster.show(this._layoutViewMaster);

        // Check authentication.
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__AUTHENTICATION_CHECK); 
    }

    /**
     * Handle authentication success.
     */
    _handleAuthenticationSuccess()
    {
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_SELECTED_COLLECTION); 
    }
}
