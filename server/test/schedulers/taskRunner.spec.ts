import * as sinon from 'sinon';
import * as chai from 'chai';
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const expect = chai.expect;

import { TaskRunner  } from '../../src/app/schedulers/taskRunner';

describe('TaskRunner', () => {
  let taskRunner: TaskRunner;

  describe('run', () => {
    beforeEach(() => {
      taskRunner = new TaskRunner();
    })  
    it('should call begin', () => {
      let stub = sinon.stub();    
      taskRunner.on('begin', stub);
      expect(stub.called).to.be.false;  
  
      taskRunner.run({});    
      expect(stub.calledOnce).to.be.true;
      expect(stub.callCount).to.equal(1);
    })
  
    it('should not call end before waiting delay', (done) => {
      let stub = sinon.stub();    
      taskRunner.on('end', stub);
      
      taskRunner.run({
        whenToExecute: 15    
      });    
      setTimeout(() => {
        expect(stub.called).to.be.false;          
        done();
      }, 5);
    })

    it('should call end after waiting delay', (done) => {
      let stub = sinon.stub();    
      taskRunner.on('end', stub);
  
      taskRunner.run({
        whenToExecute: 5      
      });    
      setTimeout(() => {
        expect(stub.called).to.be.true;          
        done();
      }, 15);
    });

    it('should not call end before executing task', (done) => {
      let stub = sinon.stub();    
      taskRunner.on('end', stub);
  
      taskRunner.run({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              let res = 'result';
              resolve(res);
            }, 25);
          })
        }
      });    

      setTimeout(() => {
        expect(stub.called).to.be.false;          
        done();
      }, 15);
    })

    it('should call end after executing task', (done) => {
      let stub = sinon.stub();    
      taskRunner.on('end', stub);
  
      taskRunner.run({
        whenToExecute: 5,                
        task: () => { 
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve()
            }, 5);
          })
        }
      });    

      setTimeout(() => {
        expect(stub.called).to.be.true;          
        done();
      }, 20);
    })

    it('should call data after taskExecution', (done) => {
      let stub = sinon.stub();    
      taskRunner.on('data', stub);

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
        expect(stub.called).to.be.true; 
        expect(stub.calledWith('result')).to.be.true;         
        done();
      }, 30);
    })
  })
})

