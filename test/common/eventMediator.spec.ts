import { assert } from 'chai';
import { IEventMediator, EventMediator } from '../../src/common/eventMediator';

describe.only('EventMediator', () => {
  let mediator: IEventMediator;  

  beforeEach(() => {
    mediator = new EventMediator();
  })

	it('triggers callbacks and removes', (done) => {
		let handler = (data) => {
			assert.equal(data.key, 'value');
			done();
		};

		mediator.addListener('event', handler);

		mediator.publish('event', {key: 'value'});
    
		mediator.removeListener('event', handler);
    
    let events = mediator.eventNames().filter(n => n == 'event');
		assert.deepEqual(events, []);
	});

	it('clears handlers', () => {
    mediator.addListener('event', () => {})
    mediator.removeAllListeners();
		assert.deepEqual(mediator.eventNames(), []);
	});

});