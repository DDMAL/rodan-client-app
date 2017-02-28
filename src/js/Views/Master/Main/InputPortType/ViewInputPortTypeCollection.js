import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';
import RodanClientCore from 'rodan-client-core';
import ViewInputPortTypeCollectionItem from './ViewInputPortTypeCollectionItem';

/**
 * InputPortType Collection view.
 */
export default class ViewInputPortTypeCollection extends Marionette.CompositeView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initializes the instance.
     *
     * @param {object} options Marionette.View options object; 'options.workflowjob' (WorkflowJob) must also be provided
     */
    initialize(options)
    {
        var jobCollection = RodanClientCore.channel.request(RodanClientCore.events.REQUEST__GLOBAL_JOB_COLLECTION);
        var job = jobCollection.get(options.workflowjob.getJobUuid());
        /** @ignore */
        this.collection = job.get('input_port_types');
    }
}
ViewInputPortTypeCollection.prototype.modelEvents = {
    'all': 'render'
};
ViewInputPortTypeCollection.prototype.template = '#template-main_inputporttype_collection';
ViewInputPortTypeCollection.prototype.childView = ViewInputPortTypeCollectionItem;
ViewInputPortTypeCollection.prototype.childViewContainer = 'tbody';