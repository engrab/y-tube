import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req, res) => {
    
    // get user detail from frontend
    // validation - not empty
    // check if user already exist - username and email
    // check for image and check for avatar
    // upload them to cloudinary - avatar
    // create user object - create enty in db
    // remove password and refresh token field from response
    // check user creation
    // return response

    const {userName, fullName, email, password} = req.body
    console.log("username: ", userName)

    if(
        [userName, fullName, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existUser = await User.findOne({
        $or: [{ userName }, { fullName }]
    })

    if(existUser){
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    console.log("req.files:", req.files);
    console.log("avatarLocalPath:", avatarLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar LocalPath is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    console.log(`${avatar}`);
    

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        coverImage: coverImage?.url || "",
        avatar: avatar.url,
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user in database")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register successfully")
    )





})

export { registerUser }