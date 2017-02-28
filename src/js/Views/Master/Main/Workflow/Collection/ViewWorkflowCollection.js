import BaseViewCollection from 'js/Views/Master/Main/BaseViewCollection';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewWorkflowCollectionItem from './ViewWorkflowCollectionItem';

/**
 * Workflow Collection view.
 */
export default class ViewWorkflowCollection extends BaseViewCollection
{
    _handleButtonNewWorkflow()
    {
        var project = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_GET_ACTIVE);
        RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOW_CREATE, {project: project});
    }

    _handleButtonImportWorkflow()
    {
        var project = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__PROJECT_GET_ACTIVE);
        for (var i = 0; i < this.ui.fileInput[0].files.length; i++)
        {
        	var file = this.ui.fileInput[0].files[i];
    	    RodanClientCore.channel.request(RodanClientCore.events.REQUEST__WORKFLOW_IMPORT, {project: project, file: file});
    	}
	    this.ui.fileInput.replaceWith(this.ui.fileInput = this.ui.fileInput.clone(true));
    }
}
ViewWorkflowCollection.prototype.template = '#template-main_workflow_collection';
ViewWorkflowCollection.prototype.childView = ViewWorkflowCollectionItem;
ViewWorkflowCollection.prototype.behaviors = {Table: {'table': '#table-workflows'}};
ViewWorkflowCollection.prototype.ui = {
    newWorkflowButton: '#button-new_workflow',
    fileInput: '#file-import_workflow'
};
ViewWorkflowCollection.prototype.events = {
    'click @ui.newWorkflowButton': '_handleButtonNewWorkflow',
    'change @ui.fileInput': '_handleButtonImportWorkflow'
};