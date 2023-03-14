// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract OtpGenerate {
    struct OtpCreate {
        uint256 OtpId;
        uint256 expirationTime;
    }

    mapping(uint256 => OtpCreate) public Otp;
    event OtpCreationEvent(uint256 OtpId);

    function GenerateOtp(uint256 _userId) public {
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.difficulty))
        );
        Otp[_userId].OtpId = randomNumber % 10000;
        Otp[_userId].expirationTime = block.timestamp + 120; // OTP expires in 2 min
        emit OtpCreationEvent(Otp[_userId].OtpId);
    }

    function VerifyOtp(uint256 _userId, uint256 _otp) public view {
        require(_otp == Otp[_userId].OtpId, "Enter the valid OTP");
        require(
            block.timestamp < Otp[_userId].expirationTime,
            "Time has expired"
        );
    }
}
