import _ from 'underscore';
import BaseController from './BaseController';
import Events from 'js/Events';
import ViewControlWorkflowJob from 'js/Views/Master/Main/WorkflowJob/ViewControlWorkflowJob';
import LayoutViewControlPorts from 'js/Views/Master/Main/WorkflowJob/LayoutViewControlPorts';
import LayoutViewResourceAssignment from 'js/Views/Master/Main/ResourceAssignment/LayoutViewResourceAssignment';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewJobCollection from 'js/Views/Master/Main/Job/Collection/ViewJobCollection';
import ViewResourceCollectionModal from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollectionModal';
import ViewResourceCollectionModalItem from 'js/Views/Master/Main/Resource/Collection/ViewResourceCollectionModalItem';
import ViewWorkflow from 'js/Views/Master/Main/Workflow/Individual/ViewWorkflow';
import ViewWorkflowCollection from 'js/Views/Master/Main/Workflow/Collection/ViewWorkflowCollection';
import ViewWorkflowCollectionImportItem from 'js/Views/Master/Main/Workflow/Collection/ViewWorkflowCollectionImportItem';
import ViewWorkflowJobGroup from 'js/Views/Master/Main/WorkflowJobGroup/ViewWorkflowJobGroup';
import ViewSettings from 'js/Views/Master/Main/WorkflowJob/ViewSettings';

/**
 * Controller for the WorkflowBuilder.
 */
export default class ControllerWorkflowBuilder extends BaseController
{
////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializer.
     */
    initialize()
    {
        this._resourcesAvailable = []; // this is just a cache for resources that will work with a given input port
    }

////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        RodanClientCore.channel.on(RodanClientCore.events.EVENT__WORKFLOWBUILDER_SELECTED, options => this._handleEventBuilderSelected(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_JOBCOLLECTION_VIEW, options => this._handleRequestShowJobCollectionView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW, options => this._handleRequestShowResourceAssignmentView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWCOLLECTION_VIEW, options => this._handleRequestShowWorkflowCollectionView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW, options => this._handleRequestShowWorkflowView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW, options => this._handleRequestShowWorkflowJobView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW, options => this._handleRequestShowWorkflowJobPortsView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW, options => this._handleRequestShowWorkflowJobSettingsView(options), this);
        Radio.channel('rodan').reply(Events.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW, options => this._handleRequestShowWorkflowJobGroupView(options), this);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle selection.
     */
    _handleEventBuilderSelected(options)
    {
        this._resourcesAvailable = [];
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_LOAD_WORKFLOW, {'workflow': options.workflow});
    }

    /**
     * Handle request show Resource assignment view.
     */
    _handleRequestShowResourceAssignmentView(options)
    {
        // Create views.
        var inputPort = options.inputport;
        var assignedResources = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOWBUILDER_GET_RESOURCEASSIGNMENTS, {inputport: inputPort});
        var availableResources = this._getResourcesAvailable(inputPort);
        var assignedResourceView = new ViewResourceCollectionModal({collection: assignedResources,
                                                                    childView: ViewResourceCollectionModalItem,
                                                                    childViewOptions: {assigned: true, 
                                                                                       requestdata: {workflow: options.workflow, inputport: inputPort},
                                                                                       assignrequest: RodanClientCore.events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE,
                                                                                       unassignrequest: RodanClientCore.events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE}});
        var resourceListView = new ViewResourceCollectionModal({collection: availableResources,
                                                                childView: ViewResourceCollectionModalItem,
                                                                childViewOptions: {assigned: false, 
                                                                                   requestdata: {workflow: options.workflow, inputport: inputPort},
                                                                                   assignrequest: RodanClientCore.events.REQUEST__WORKFLOWBUILDER_ASSIGN_RESOURCE,
                                                                                   unassignrequest: RodanClientCore.events.REQUEST__WORKFLOWBUILDER_UNASSIGN_RESOURCE}});

        // Show the layout view.
        var view = new LayoutViewResourceAssignment({viewavailableresources: resourceListView, viewassignedresources: assignedResourceView});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'InputPort'});
    }

    /**
     * Handle request get Workflow view.
     */
    _handleRequestShowWorkflowView(options)
    {
        var view = new ViewWorkflow({template: '#template-main_workflow_individual_edit', model: options.workflow});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'Workflow'});
    }

    /**
     * Handle request get WorkflowJob view.
     */
    _handleRequestShowWorkflowJobView(options)
    {
        var view = new ViewControlWorkflowJob({model: options.workflowjob, workflow: options.workflow});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: options.workflowjob.get('name')});
    }

    /**
     * Handle request show Job collection view.
     */
    _handleRequestShowJobCollectionView(options)
    {
        var collection = new RodanClientCore.JobCollection();
        collection.fetch();
        var view = new ViewJobCollection({collection: collection, childViewOptions: {workflow: options.workflow}});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'Jobs'});
    }

    /**
     * Handle request show Workflow collection view.
     */
    _handleRequestShowWorkflowCollectionView(options)
    {
        var collection = new RodanClientCore.WorkflowCollection();
        collection.fetch({data: {/*project: project.id, */valid: 'True'}});
        var project = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_GET_ACTIVE);
        var view = new ViewWorkflowCollection({collection: collection,
                                         childView: ViewWorkflowCollectionImportItem,
                                         template: '#template-main_workflow_collection_import',
                                         childViewOptions: {workflow: options.workflow}});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'Workflows'});
    }

    /**
     * Handle request show WorkflowJobGroup view.
     */
    _handleRequestShowWorkflowJobGroupView(options)
    {
        var view = new ViewWorkflowJobGroup({workflow: options.workflow, workflowjobgroup: options.workflowjobgroup});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'Workflow Job Group'});
    }

    /**
     * Handle request show WorkflowJob ports view.
     */
    _handleRequestShowWorkflowJobPortsView(options)
    {
        var view = new LayoutViewControlPorts(options);
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'WorkflowJob Ports'});
    }

    /**
     * Handle request show WorkflowJob settings view.
     */
    _handleRequestShowWorkflowJobSettingsView(options)
    {
        var view = new ViewSettings({workflow: options.workflow, model: options.workflowjob});
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'WorkflowJob Settings'});
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Given an array of InputPorts, returns an array of ResourceType URLs that
     * would satisfy the InputPorts.
     */
    _getCompatibleResourceTypeURLs(inputPorts)
    {
        var resourceTypes = [];
        var inputPortTypes = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__GLOBAL_INPUTPORTTYPE_COLLECTION);
        for (var index in inputPorts)
        {
            // Get the available resource types.
            var inputPort = inputPorts[index];
            var inputPortTypeURL = inputPort.get('input_port_type');
            var inputPortType = inputPortTypes.findWhere({url: inputPortTypeURL});
            var inputPortResourceTypes = inputPortType.get('resource_types');

            // If this is the first iteration, set the array. Else, do an intersection.
            if (resourceTypes.length === 0)
            {
                resourceTypes = inputPortResourceTypes;
            }
            resourceTypes = _.intersection(resourceTypes, inputPortResourceTypes);
        }
        return resourceTypes;
    }

    /**
     * Given an OutputPort, returns an array of ResourceType URLs that would satisfy it.
     */
    _getOutputPortResourceTypeURLs(outputPort)
    {
        var resourceTypes = [];
        var outputPortTypes = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_OUTPUTPORTTYPE_COLLECTION);
        var outputPortTypeURL = outputPort.get('output_port_type');
        var outputPortType = outputPortTypes.findWhere({url: outputPortTypeURL});
        var outputPortResourceTypes = outputPortType.get('resource_types');
        return outputPortResourceTypes;
    }

    /**
     * Given an array of ResourceType URLs, finds jobs that both give at least one and take at least
     * one of the ResourceTypes. The returned array {job: Job, inputporttypes: URL strings, outputporttypes: URL string}.
     * The port types are those ports of the associated Job that will satisfy the resource requirements.
     */
    _getCandidateResourceDistributorJobs(resourceTypes)
    {
        var jobs = Radio.channel('rodan').request(RODAN_EVENTS.REQUEST__GLOBAL_JOB_COLLECTION).where({category: RodanClientCore.config.RESOURCE_DISTRIBUTOR_CATEGORY});
        var satisfiableJobs = [];
        for (var i = 0; i < jobs.length; i++)
        {
            var job = jobs[i];
            var inputPortType = job.get('input_port_types').at(0);
            var outputPortType = job.get('output_port_types').at(0);

            // Intersect against InputPortType ResourceTypes.
            var intersect = _.intersection(resourceTypes, inputPortType.get('resource_types'));
            if (intersect.length === 0)
            {
                continue;
            }

            intersect = _.intersection(resourceTypes, outputPortType.get('resource_types'));
            if (intersect.length === 0)
            {
                continue;
            }
            
            // We want to keep this job.
            satisfiableJobs.push(job);
        }
        return satisfiableJobs;
    }

    /**
     * Returns resources available for given InputPort.
     */
    _getResourcesAvailable(inputPort)
    {
        if (!this._resourcesAvailable[inputPort.get('url')])
        {
            var project = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_GET_ACTIVE);
            var resourceTypeURLs = this._getCompatibleResourceTypeURLs([inputPort]);
            var data = {project: project.id, resource_type__in: ''};
            var globalResourceTypes = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__GLOBAL_RESOURCETYPE_COLLECTION);
            var first = true;
            for (var index in resourceTypeURLs)
            {
                var idString = null;
                if (first)
                {
                    first = false;
                    idString = globalResourceTypes.findWhere({url: resourceTypeURLs[index]}).id;
                }
                else
                {
                    idString = ',' + globalResourceTypes.findWhere({url: resourceTypeURLs[index]}).id;
                }
                data.resource_type__in = data.resource_type__in + idString;
            }
            this._resourcesAvailable[inputPort.get('url')] = new RodanClientCore.ResourceCollection();
            this._resourcesAvailable[inputPort.get('url')].fetch({data: data});
        }
        this._resourcesAvailable[inputPort.get('url')].syncCollection();
        return this._resourcesAvailable[inputPort.get('url')];
    }
}