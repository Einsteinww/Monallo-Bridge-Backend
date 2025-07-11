// import { Router, Request, Response, NextFunction, raw } from 'express';
// import {
//   JsonRpcProvider,
//   Wallet,
//   Contract,
//   parseEther,
//   formatEther
// } from 'ethers';
// import dotenv from 'dotenv';
// import token from '../abi/abi.json';
// import LockRecord from '../models/LockRecord';
// import { asyncHandler } from '../utils/asyncHandler';
// import { WebSocketProvider } from 'ethers';

// dotenv.config();

// const router = Router();
// const abi = token.abi;

// router.post(
//   '/',
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { fromAddress, toAddress, amount } = req.body;

//     if (!fromAddress || !toAddress || amount === undefined) {
//       return res.status(400).json({
//         success: false,
//         error: '缺少参数: fromAddress, toAddress 或 amount',
//       });
//     }

//     const RPC_URL = process.env.ETH_RPC_URL!;
//     const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
//     const PRIVATE_KEY = process.env.PRIVATE_KEY!;

//     if (!RPC_URL || !CONTRACT_ADDRESS || !PRIVATE_KEY) {
//       return res.status(500).json({
//         success: false,
//         error: '环境变量配置缺失（ETH_RPC_URL / CONTRACT_ADDRESS / PRIVATE_KEY）',
//       });
//     }

//     try {
//       const provider = new WebSocketProvider(RPC_URL);
//       const wallet = new Wallet(PRIVATE_KEY, provider);
//       const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);

//       const amountParsed = parseEther(amount.toString());

//       const walletAddress = wallet.address;
//       const balance = await provider.getBalance(walletAddress);
//       console.log('钱包地址:', walletAddress);
//       console.log('钱包余额:', formatEther(balance), 'ETH');

//       if (balance < amountParsed) {
//         return res.status(400).json({
//           success: false,
//           error: `钱包余额不足（当前余额 ${formatEther(balance)} ETH，所需 ${amount} ETH）`,
//         });
//       }

//       const tx = await contract.lock(toAddress, {
//         value: amountParsed,
//       });

//       const receipt = await tx.wait();
//       const sourceFromTxHash = tx.hash;

//       console.log('锁币成功，交易Hash:', sourceFromTxHash);

//       const lockedLog = receipt.logs?.find((log: any) => {
//         return log.fragment?.name === 'Locked';
//       });

//      const rawFee = lockedLog?.args?.fee?.toString() || null;
//       const fee = rawFee ? formatEther(rawFee) : null;

//       const record = new LockRecord({
//         fromAddress,
//         toAddress,
//         amount,
//         sourceFromTxHash,
//         fee,
//         status: 'pending',
//         timestamp: new Date(),
//       });
//       await record.save();
//       console.log('锁定记录已保存到数据库:', record);
//       console.log('合约交互成功，交易Hash:', sourceFromTxHash);
//       console.log('锁定金额:', amount, 'ETH');
//       console.log('交易费用:', fee, 'ETH');
//       console.log('原始交易费用',rawFee, 'wei');
//       console.log('交易收据:', receipt);
//       res.json({
//         success: true,
//         txHash: sourceFromTxHash,
//         fee,
//         receipt,
//       });
//     } catch (error: any) {
//       console.error('[锁币交互失败]', error);
//       res.status(500).json({
//         success: false,
//         error: error.message || '合约交互失败',
//         details: error,
//       });
//     }
//   })
// );

// export default router;
