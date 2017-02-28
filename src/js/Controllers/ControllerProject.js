import BaseController from './BaseController';
import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import BaseViewCollectionItem from 'js/Views/Master/Main/BaseViewCollectionItem';
import Events from 'js/Events';
import LayoutViewModel from 'js/Views/Master/Main/LayoutViewModel';
import LayoutViewProjectUsers from 'js/Views/Master/Main/Project/Individual/LayoutViewProjectUsers';
import Radio from 'backbone.radio';
import rodan from 'rodan-client-core';
import ViewProject from 'js/Views/Master/Main/Project/Individual/ViewProject';
import ViewProjectCollection from 'js/Views/Master/Main/Project/Collection/ViewProjectCollection';
import ViewUserCollectionItem from 'js/Views/Master/Main/User/Collection/ViewUserCollectionItem';
import ViewWorkflowRunCollection from 'js/Views/Master/Main/WorkflowRun/Collection/ViewWorkflowRunCollection';

/**
 * Controller for Projects.
 */
export default class ControllerProject extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize the instance.
     */
    initialize()
    {
        this._activeProject = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - initialization
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        // Rodan core events.
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_ADDED_USER_ADMIN, options => this._handleEventProjectAddedUserAdmin(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_ADDED_USER_WORKER, options => this._handleEventProjectAddedUserWorker(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_CREATED, options => this._handleEventProjectGenericResponse(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_DELETED, options => this._handleEventProjectDeleteResponse(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_REMOVED_USER_ADMIN, options => this._handleEventProjectRemovedUser(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_REMOVED_USER_WORKER, options => this._handleEventProjectRemovedUser(options));
        rodan.rodan_client_core.channel.on(rodan.rodan_client_core.events.EVENT__PROJECT_SAVED, options => this._handleEventProjectGenericResponse(options));

        // App events.
        Radio.channel('rodan').on(Events.EVENT__PROJECT_SELECTED, options => this._handleEventItemSelected(options));
        Radio.channel('rodan').on(Events.EVENT__PROJECT_SELECTED_COLLECTION, () => this._handleEventCollectionSelected());
        Radio.channel('rodan').on(Events.EVENT__PROJECT_USERS_SELECTED, options => this._handleEventProjectShowUsers(options));
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Event handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle event Project show users.
     */
    _handleEventProjectShowUsers(options)
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);

        // Make sure project is updated.
        options.project.fetch();

        // Create collections to store admins and workers.
        var adminUserCollection = new rodan.rodan_client_core.UserCollection();
        var workerUserCollection = new rodan.rodan_client_core.UserCollection();

        // Get admins and workers for project.
        var ajaxSettingsAdmins = {success: (response) => this._handleProjectGetAdminsSuccess(response, adminUserCollection),
                                  error: (response) => rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__SYSTEM_HANDLE_ERROR, {response: response}),
                                  type: 'GET',
                                  dataType: 'json',
                                  url: options.project.get('url') + 'admins/'};
        var ajaxSettingsWorkers = {success: (response) => this._handleProjectGetWorkersSuccess(response, workerUserCollection),
                                   error: (response) => rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__SYSTEM_HANDLE_ERROR, {response: response}),
                                   type: 'GET',
                                   dataType: 'json',
                                   url: options.project.get('url') + 'workers/'};
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__SERVER_REQUEST_AJAX, {settings: ajaxSettingsAdmins});
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__SERVER_REQUEST_AJAX, {settings: ajaxSettingsWorkers});

        // Need collection for all users.
        var collection = new rodan.rodan_client_core.UserCollection();
        collection.fetch();
        var userSelectionView = new BaseViewCollection({collection: collection,
                                                        template: '#template-main_user_selection',
                                                        childView: BaseViewCollectionItem,
                                                        childViewContainer: 'select',
                                                        childViewOptions: {template: '#template-main_user_selection_item',
                                                                           tagName: 'option'}});

        // Create view.
        var projectAdminsView = new BaseViewCollection({collection: adminUserCollection,
                                                        template: '#template-main_user_collection', 
                                                        childView: ViewUserCollectionItem,
                                                        childViewOptions: {template: '#template-main_user_collection_item_remove',
                                                                           project: options.project,
                                                                           admin: true}});
        var projectWorkersView = new BaseViewCollection({collection: workerUserCollection,
                                                         template: '#template-main_user_collection',
                                                         childView: ViewUserCollectionItem,
                                                         childViewOptions: {template: '#template-main_user_collection_item_remove',
                                                                            project: options.project}});
        var view = new LayoutViewProjectUsers({viewusers: userSelectionView,
                                               viewprojectadmins: projectAdminsView,
                                               viewprojectworkers: projectWorkersView,
                                               project: options.project});

        // Show modal.
        Radio.channel('rodan').request(Events.REQUEST__MODAL_SHOW, {content: view, title: 'Project Users'});
    }

    /**
     * Handle event Project generic response.
     */
    _handleEventProjectGenericResponse()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__GLOBAL_PROJECTS_LOAD, {});
    }

    /**
     * Handle event Project delete response.
     */
    _handleEventProjectDeleteResponse()
    {
        Radio.channel('rodan').request(Events.REQUEST__MODAL_HIDE);
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__GLOBAL_PROJECTS_LOAD, {});
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_SELECTED_COLLECTION);
    }

    /**
     * Handle item selection.
     */
    _handleEventItemSelected(options)
    {
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__PROJECT_SET_ACTIVE, {project: options.project});
        this._activeProject = options.project;
        this._activeProject.fetch();
        var collection = new rodan.rodan_client_core.WorkflowRunCollection();
        collection.fetch({data: {project: this._activeProject.id}});
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        var layoutView = new LayoutViewModel({template: '#template-main_layoutview_model_inverse'});
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: layoutView});
        layoutView.showItem(new ViewProject({model: this._activeProject}));
        layoutView.showCollection(new ViewWorkflowRunCollection({collection: collection}));
    }

    /**
     * Handle collection selection.
     */
    _handleEventCollectionSelected()
    {
        var collection = rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__GLOBAL_PROJECT_COLLECTION);
        rodan.rodan_client_core.channel.request(rodan.rodan_client_core.events.REQUEST__UPDATER_SET_COLLECTIONS, {collections: [collection]});
        var view = new ViewProjectCollection({collection: collection});
        Radio.channel('rodan').request(Events.REQUEST__MAINREGION_SHOW_VIEW, {view: view});
    }

    /**
     * Handle project admins get success.
     */
    _handleProjectGetAdminsSuccess(response, collection)
    {
        collection.fetch({data: {username__in: response.join()}});
    }

    /**
     * Handle project workers get success.
     */
    _handleProjectGetWorkersSuccess(response, collection)
    {
        collection.fetch({data: {username__in: response.join()}});
    }

    /**
     * Handle project removed user.
     */
    _handleEventProjectRemovedUser(options)
    {
        this._activeProject.fetch();
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_USERS_SELECTED, {project: this._activeProject});
    }

    /**
     * Handle event added admin.
     */
     _handleEventProjectAddedUserAdmin()
     {
        this._activeProject.fetch();
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_USERS_SELECTED, {project: this._activeProject});
     }

    /**
     * Handle event added worker.
     */
     _handleEventProjectAddedUserWorker()
     {
        this._activeProject.fetch();
        Radio.channel('rodan').trigger(Events.EVENT__PROJECT_USERS_SELECTED, {project: this._activeProject});
     }
}
