import BaseController from './BaseController';
import Events from 'js/Events';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';
import ViewWorkflow from 'js/Views/Master/Main/Workflow/Individual/ViewWorkflow';
import ViewWorkflowCollection from 'js/Views/Master/Main/Workflow/Collection/ViewWorkflowCollection';

/**
 * Controller for Workflows.
 */
export default class ControllerWorkflow extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialization
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        Radio.channel('rodan').on(Events.EVENT__WORKFLOW_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options));
        Radio.channel('rodan').on(Events.EVENT__WORKFLOW_SELECTED, options => this._handleEventItemSelected(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle collection selection.
     */
    _handleEventCollectionSelected(options)
    {
        var collection = new rodan.rodan_client_core.WorkflowCollection();
        collection.fetch({data: {project: options.project.id}});
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        this._layoutView = new LayoutViewModel();
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._layoutView});
        this._viewCollection = new ViewWorkflowCollection({collection: collection});
        this._layoutView.showCollection(this._viewCollection);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        this._viewItem = new ViewWorkflow({model: options.workflow});
        this._layoutView.showItem(this._viewItem);
    }
}