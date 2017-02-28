import BaseController from './BaseController';
import Events from 'js/Events';
import LayoutViewIndividualWorkflowRun from 'js/Views/Master/Main/WorkflowRun/Individual/LayoutViewIndividualWorkflowRun';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewWorkflowRunCollection from 'js/Views/Master/Main/WorkflowRun/Collection/ViewWorkflowRunCollection';

/**
 * Controller for WorkflowRun.
 */
export default class ControllerWorkflowRun extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Initialize
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__WORKFLOWRUN_CREATED, options => this._handleEventWorkflowRunStartResponse(options));
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__WORKFLOWRUN_DELETED, options => this._handleEventWorkflowRunDeleteResponse(options));
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__WORKFLOWRUN_STARTED, options => this._handleEventWorkflowRunStartResponse(options));
        Radio.channel('rodan').on(Events.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, options => this._handleEventCollectionSelected(options), this);
        Radio.channel('rodan').on(Events.EVENT__WORKFLOWRUN_SELECTED, options => this._handleEventItemSelected(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event WorkflowRun delete response.
     */
    _handleEventWorkflowRunDeleteResponse(options)
    {
        var project = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_GET_ACTIVE);
        Radio.channel('rodan').trigger(Events.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, {project: project});
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        // Get required collections.
        var runJobs = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__RUNJOBS_LOAD, {data: {workflow_run: options.workflowrun.id}});
        var resources = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__RESOURCES_LOAD, {data: {result_of_workflow_run: options.workflowrun.id}});
        Radio.channel('rodan').request(RodanClientCore.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [runJobs, resources]});

        // Create view and show.
        this._viewItem = new LayoutViewIndividualWorkflowRun({runjobs: runJobs, resources: resources, model: options.workflowrun});
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: this._viewItem});
    }

    /**
     * Handle collection selection.
     */
    _handleEventCollectionSelected(options)
    {
        var collection = new RodanClientCore.WorkflowRunCollection();
        collection.fetchSort(false, 'created', {data: {project: options.project.id}});
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        var view = new ViewWorkflowRunCollection({collection: collection});
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
    }

    /**
     * Handle event WorkflowRun start response.
     */
    _handleEventWorkflowRunStartResponse(options)
    {
        var project = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_GET_ACTIVE);
        Radio.channel('rodan').trigger(Events.EVENT__WORKFLOWRUN_SELECTED_COLLECTION, {project: project});
    }
}