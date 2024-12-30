import { SecurityCore } from '../../core/security-core';

describe('SecurityCore', () => {
  let securityCore: SecurityCore;
  const testMasterKey = 'test-master-key';

  beforeEach(() => {
    securityCore = new SecurityCore();
  });

  it('initializes with master key', async () => {
    await expect(securityCore.initialize(testMasterKey)).resolves.not.toThrow();
  });

  it('encrypts and decrypts data correctly', async () => {
    await securityCore.initialize(testMasterKey);
    const testData = 'test-data';
    
    const encrypted = await securityCore.encrypt(testData);
    expect(typeof encrypted).toBe('string');
    
    const decrypted = await securityCore.decrypt(encrypted);
    expect(decrypted).toBe(testData);
  });

  it('encrypts and decrypts objects correctly', async () => {
    await securityCore.initialize(testMasterKey);
    const testData = { key: 'value', number: 123 };
    
    const encrypted = await securityCore.encrypt(testData);
    expect(typeof encrypted).toBe('string');
    
    const decrypted = await securityCore.decrypt(encrypted);
    expect(decrypted).toEqual(testData);
  });

  it('throws error when not initialized', async () => {
    await expect(securityCore.encrypt('test')).rejects.toThrow('Security core not initialized');
    await expect(securityCore.decrypt('test')).rejects.toThrow('Security core not initialized');
  });

  it('clears sensitive data on destroy', async () => {
    await securityCore.initialize(testMasterKey);
    securityCore.destroy();
    await expect(securityCore.encrypt('test')).rejects.toThrow('Security core not initialized');
  });
});
