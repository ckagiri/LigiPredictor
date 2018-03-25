import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { TaskRunner  } from '../../src/app/schedulers/taskRunner';

describe('TaskRunner', () => {
  let taskRunner = new TaskRunner();

  describe('run', () => {

    it('should call begin', () => {
      let spy = sinon.spy();    
      taskRunner.on('begin', spy);
      expect(spy.called).to.be.false;  
  
      taskRunner.run({});    
      expect(spy.calledOnce).to.be.true;
      expect(spy.callCount).to.equal(1);
    })
  
    it('should not call end before waiting delay', (done) => {
      let spy = sinon.spy();    
      taskRunner.on('end', spy);
      
      taskRunner.run({
        whenToExecute: 15        
      });    
      setTimeout(() => {
        expect(spy.called).to.be.false;          
        done();
      }, 5);
    })

    it('should call end after waiting delay', (done) => {
      let spy = sinon.spy();    
      taskRunner.on('end', spy);
  
      taskRunner.run({
        whenToExecute: 5      
      });    
      setTimeout(() => {
        expect(spy.called).to.be.true;          
        done();
      }, 10);
    });

    it('should not call end before executing task', (done) => {
      let spy = sinon.spy();    
      taskRunner.on('end', spy);
  
      taskRunner.run({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              let res = 'result';
              resolve(res);
            }, 15);
          })
        }
      });    

      setTimeout(() => {
        expect(spy.called).to.be.false;          
        done();
      }, 10);
    })

    it('should call end after executing task', (done) => {
      let spy = sinon.spy();    
      taskRunner.on('end', spy);
  
      taskRunner.run({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
            }, 5);
          })
        }
      });    

      setTimeout(() => {
        expect(spy.called).to.be.true;          
        done();
      }, 20);
    })

    it('should call data after taskExecution', (done) => {
      let spy = sinon.spy();    
      taskRunner.on('data', spy);

      taskRunner.run({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              let res = 'result';
              resolve(res);
            }, 5);
          })
        }
      });    

      setTimeout(() => {
        expect(spy.called).to.be.true; 
        expect(spy.calledWith('result')).to.be.true;         
        done();
      }, 15);
    })
  })
})

