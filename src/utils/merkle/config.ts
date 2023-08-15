import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';
import { BETA_WHITELIST } from './addresses';

export const useMerkle = () => {
    const padBuffer = (addr: string) => {
        return Buffer.from(addr.substr(2).padStart(32 * 2, '0'), 'hex');
    };
    const merkleLeaves = BETA_WHITELIST.map((el) => padBuffer(el));
    const merkleTree = new MerkleTree(merkleLeaves, ethers.utils.keccak256, { sort: true });
    const merkleRoot = merkleTree.getRoot();
    return {
        leaves: merkleLeaves,
        tree: merkleTree,
        root: merkleRoot,
        padBuffer,
    };
};
