import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import logger from '../src/lib/logger';

describe('structured logger', () => {
  let logSpy;
  let errSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emits JSON with expected fields for info', () => {
    logger.info('test.message', { foo: 'bar' });
    expect(logSpy).toHaveBeenCalled();
    const arg = logSpy.mock.calls[0][0];
    const obj = JSON.parse(arg);
    expect(obj).toHaveProperty('ts');
    expect(obj).toHaveProperty('level', 'info');
    expect(obj).toHaveProperty('message', 'test.message');
    expect(obj).toHaveProperty('meta');
    expect(obj.meta).toMatchObject({ foo: 'bar' });
  });

  it('uses stderr for errors', () => {
    logger.error('big.problem', { code: 123 });
    expect(errSpy).toHaveBeenCalled();
    const arg = errSpy.mock.calls[0][0];
    const obj = JSON.parse(arg);
    expect(obj.level).toBe('error');
    expect(obj.message).toBe('big.problem');
    expect(obj.meta.code).toBe(123);
  });
});
