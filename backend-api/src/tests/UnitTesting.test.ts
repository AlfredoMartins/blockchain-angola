import BlockChain from '../blockchain/blockchain';
import { randomUUID } from 'crypto';
import { jest } from '@jest/globals';
import CryptoBlockchain from '../crypto/cryptoBlockchain';
import fs from 'fs';

describe('BlockChain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new BlockChain();
  });

  test('Creates a new instance of BlockChain', () => {
    expect(blockchain).toBeInstanceOf(BlockChain);
  });

  test('Check existence of the one block, the GenesisBlock and eturns the chain of blocks', () => {
    const chain = blockchain.getChain();
    expect(chain).toBeInstanceOf(Array);
    expect(chain.length).toBe(1); // Assuming genesis block is always present
  });

  test('Encrypt and Decrypt Data Identifier', () => {
    const data = 'We are performing a unit testing.';
    const encryptedData = blockchain.encryptDataIdentifier(data);
    const decryptedData = blockchain.decryptDataIdentifier(encryptedData);

    expect(decryptedData).toBe(data);
  });

  test('Encrypt and Decrypt Data Voter', () => {
    const data = 'We are performing a unit testing.';
    const encryptedData = blockchain.encryptDataVoter(data);
    const decryptedData = blockchain.decryptDataVoter(encryptedData);

    expect(decryptedData).toBe(data);
  });

  test('Hash Data using SHA256', () => {
    const data = 'We are performing a unit testing.';
    const hash = blockchain.hashData(data);

    // The result should be a string of 64 hexadecimal characters
    expect(hash).toMatch(/^[0-9a-fA-F]{64}$/);
  });
});

describe('Network', () => {
  test('Generates different node addresses', () => {
    const ids = [1, 2].map(_ => randomUUID().split('-').join('').substr(0, 4));
    expect(ids[0]).not.toBe(ids[1]);
  });
});

describe('Secret generation Tests', () => {
  let cyptoChain;

  beforeEach(() => {
    cyptoChain = new CryptoBlockchain("", ""); // Pass empty strings for KEY_VAR and IV_VAR
  });

  it('Generate a secret key and IV', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Mock fs.writeFileSync
    fs.writeFileSync = jest.fn();

    cyptoChain.generateSecret();
    
    expect(fs.writeFileSync).toHaveBeenCalledWith('secret.key', expect.any(String));
    expect(consoleSpy).toHaveBeenCalledTimes(3);
  });
});