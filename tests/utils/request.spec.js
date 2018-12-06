// Needs polyfill because I used async functions.
import 'babel-polyfill';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import RequestUtil from '../../src/utils/RequestUtil';

describe('Request Util', () => {
    describe('Smoke tests', () => {
        it('Should exists get method', () => {
            expect(RequestUtil.get).to.exist;
        });

        it('Should exists post method', () => {
            expect(RequestUtil.post).to.exist;
        });
    });
});
