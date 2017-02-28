import Radio from 'backbone.radio';

let _instance = null;

/**
 * Backbone.Radio events use in the client. Do not instantiate this class.
 */
class Events
{
    /** @ignore */
    constructor()
    {
        if (_instance)
        {
            throw new Error('this class cannot be instantiated more than once');
        }
        _instance = this;

        /** @ignore */
        this.REQUEST__RESOURCE_SHOWLAYOUTVIEW = 'REQUEST__RESOURCE_SHOWLAYOUTVIEW';  // Show LayoutView for Resource control (outside of the primary Resources view). This tells the ControllerResource which LayoutView to reference upon events. Takes {layoutView: LayoutView}.
        /** @ignore */
        this.REQUEST__RUNJOB_SHOWLAYOUTVIEW = 'REQUEST__RUNJOB_SHOWLAYOUTVIEW';      // Show LayoutView for RunJob control (outside of the primary RunJobs view). This tells the ControllerRunJob which LayoutView to reference upon events. Takes {layoutView: LayoutView}.

        ///////////////////////////////////////////////////////////////////////////////////////
        // Context Menu
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request context menu be hidden. */
        this.REQUEST__CONTEXTMENU_HIDE = 'REQUEST__CONTEXTMENU_HIDE';
        /** Request context menu be shown. Takes {items: [{label: string, channel: string (Radio channel; default: 'rodan'), request: string (Radio request name), options: object (optional; options sent to Radio request)}], top: float (coordinate), left: float (coordinate)}. */
        this.REQUEST__CONTEXTMENU_SHOW = 'REQUEST__CONTEXTMENU_SHOW';

        ///////////////////////////////////////////////////////////////////////////////////////
        // General
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request "API" information to be show. */
        this.REQUEST__SHOW_API = 'REQUEST__SHOW_API',
        /** Request last 100 Radio events. Returns [{name (string), event (string), options (object)}]. */
        this.REQUEST__LOG = 'REQUEST__LOG';
        /** Request "About" information be shown. */
        this.REQUEST__SHOW_ABOUT = 'REQUEST__SHOW_ABOUT';
        /** Request "Help" page be shown. */
        this.REQUEST__SHOW_HELP = 'REQUEST__SHOW_HELP';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Main Region
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request main region be filled with provided Marionette View. Takes {view: Marionette.View}. */
        this.REQUEST__MAINREGION_SHOW_VIEW = 'REQUEST__MAINREGION_SHOW_VIEW';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Navigation
        ///////////////////////////////////////////////////////////////////////////////////////
        this.EVENT__NAVIGATION_SELECTED_NODE = 'EVENT__NAVIGATION_SELECTED_NODE';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Modal
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request an error be displayed. This is a "convenience" request -- if a modal is currently visible (which is probably related somehow to the error) the footer will be updated with the error message. If no modal visible, REQUEST__MODAL_SHOW will be called. Takes {content: Marionette.View OR string}. */
        this.REQUEST__MODAL_ERROR = 'REQUEST__MODAL_ERROR';
        /** Request modal window to hide/close. */
        this.REQUEST__MODAL_HIDE = 'REQUEST__MODAL_HIDE';
        /** Request modal window to show/open with provided Marionette View. If another modal is currently open the request will not show. Takes {content: string, title: string}. */
        this.REQUEST__MODAL_SHOW = 'REQUEST__MODAL_SHOW';
        /** Request the current modal window (if available) have the provided text set in the footer. If no modal is visible, will put message in REQUEST__MODAL_SHOW. Takes {content: Marionette.View OR string}. */
        this.REQUEST__MODAL_SHOW_IMPORTANT = 'REQUEST__MODAL_SHOW_IMPORTANT';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Project
        ///////////////////////////////////////////////////////////////////////////////////////

        /** Triggered when the user selects an individual Project. Sends {project: Project}. */
        this.EVENT__PROJECT_SELECTED = 'EVENT__PROJECT_SELECTED';
        /** Triggered when the user selects to see all available Projects. */
        this.EVENT__PROJECT_SELECTED_COLLECTION = 'EVENT__PROJECT_SELECTED_COLLECTION';
        /** Triggered when Project admin interface has been selected. Takes {project: Project}. */
        this.EVENT__PROJECT_USERS_SELECTED = 'EVENT__PROJECT_USERS_SELECTED';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Resource
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when the user selects an individual Resource. Sends {resource: Resource}. */
        this.EVENT__RESOURCE_SELECTED = 'EVENT__RESOURCE_SELECTED';
        /** Triggered when the user selects to see all available Resources. Sends {project: Project (Project associated with ResourceCollection)}. */
        this.EVENT__RESOURCE_SELECTED_COLLECTION = 'EVENT__RESOURCE_SELECTED_COLLECTION';

        ///////////////////////////////////////////////////////////////////////////////////////
        // ResourceList
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when the user selects an individual ResourceList. Sends {resourcelist: ResourceList}. */
        this.EVENT__RESOURCELIST_SELECTED = 'EVENT__RESOURCELIST_SELECTED';
        /** Triggered when the user selects to see all available ResourceLists. Sends {project: Project (Project associated with ResourceListCollection)}. */
        this.EVENT__RESOURCELIST_SELECTED_COLLECTION = 'EVENT__RESOURCELIST_SELECTED_COLLECTION';
         /** Request a resource assignment view be displayed for a ResourceList. Takes {resourcelist: ResourceList}. */
        this.REQUEST__RESOURCELIST_SHOW_RESOURCEASSIGNMENT_VIEW = 'REQUEST__RESOURCELIST_SHOW_RESOURCEASSIGNMENT_VIEW';
        /** Request a ResourceListCollection to be loaded. Takes {data: Object (query parameters)}. Returns ResourceListCollection. */
        this.REQUEST__RESOURCELISTS_LOAD = 'REQUEST__RESOURCELISTS_LOAD';

        ///////////////////////////////////////////////////////////////////////////////////////
        // RunJob
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when the user selects an individual RunJob. Sends {runjob: RunJob}. */
        this.EVENT__RUNJOB_SELECTED = 'EVENT__RUNJOB_SELECTED';
        /** Triggered when the user selects to see RunJobs for a Project. */
        this.EVENT__RUNJOB_SELECTED_COLLECTION = 'EVENT__RUNJOB_SELECTED_COLLECTION';

        ///////////////////////////////////////////////////////////////////////////////////////
        // Workflow
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when the user selects an individual Workflow. Sends {workflow: Workflow}. */
        this.EVENT__WORKFLOW_SELECTED = 'EVENT__WORKFLOW_SELECTED';
        /** Triggered when the user selects to see all available Workflows. Sends {project: Project (Project associated with WorkflowCollection)}. */
        this.EVENT__WORKFLOW_SELECTED_COLLECTION = 'EVENT__WORKFLOW_SELECTED_COLLECTION';


        ///////////////////////////////////////////////////////////////////////////////////////
        // WorkflowBuilder
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Request a Job collection view be displayed for adding Jobs to the currently loaded Workflow. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_JOBCOLLECTION_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_JOBCOLLECTION_VIEW';
        /** Request a resource assignment view be displayed for an InputPort. Takes {inputport: InputPort, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_RESOURCEASSIGNMENT_VIEW';
        /** Request a Workflow data view be displayed for a Workflow. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOW_VIEW';
        /** Request a Workflow collection view be displayed for importing Workflows. Takes {workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWCOLLECTION_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWCOLLECTION_VIEW';
        /** Request a port view for adding/deleting ports for a WorkflowJob be displayed. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_PORTS_VIEW';
        /** Request a WorkflowJob settings view be displayed for a WorkflowJob. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_SETTINGS_VIEW';
        /** Request a WorkflowJob data view be displayed for a WorkflowJob. Takes {workflowjob: WorkflowJob, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOB_VIEW';
        /** Request a WorkflowJobGroup data view be displayed for a WorkflowJobGroup. Takes {workflowjobgroup: WorkflowJobGroup, workflow: Workflow}. */
        this.REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW = 'REQUEST__WORKFLOWBUILDER_SHOW_WORKFLOWJOBGROUP_VIEW';

        ///////////////////////////////////////////////////////////////////////////////////////
        // WorkflowRun
        ///////////////////////////////////////////////////////////////////////////////////////
        /** Triggered when the user selects an individual WorkflowRun. Sends {workflow: WorkflowRun}. */
        this.EVENT__WORKFLOWRUN_SELECTED = 'EVENT__WORKFLOWRUN_SELECTED';
        /** Triggered when the user selects to see all available WorkflowRuns. Sends {project: Project (Project associated with WorkflowRunCollection)}. */
        this.EVENT__WORKFLOWRUN_SELECTED_COLLECTION = 'EVENT__WORKFLOWRUN_SELECTED_COLLECTION';


    }
}
/** @ignore */
export default new Events();