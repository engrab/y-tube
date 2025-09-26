import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

<<<<<<< HEAD
const generateAccessAndRefreshToken = async (userId) => {

    try {

        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

=======
>>>>>>> 7f2bb969cef493d9e489f5754fcd2ba5656e96a7
const registerUser = asyncHandler(async (req, res) => {

    // get user detail from frontend
    // validation - not empty
    // check if user already exist - userName and email
    // check for image and check for avatar
    // upload them to cloudinary - avatar
    // create user object - create enty in db
    // remove password and refresh token field from response
    // check user creation
    // return response

    const { userName, fullName, email, password } = req.body
<<<<<<< HEAD
    console.log("username: ", userName)
=======
    console.log("userName: ", userName)
>>>>>>> 7f2bb969cef493d9e489f5754fcd2ba5656e96a7

    if (
        [userName, fullName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existUser = await User.findOne({
        $or: [{ userName }, { fullName }]
    })

    if (existUser) {
<<<<<<< HEAD
        throw new ApiError(409, "User with email or username already exist")
=======
        throw new ApiError(409, "User with email or userName already exist")
>>>>>>> 7f2bb969cef493d9e489f5754fcd2ba5656e96a7
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    console.log("req.files:", req.files);
    console.log("coverImageLocalPath:", coverImageLocalPath);
    console.log("avatarLocalPath:", avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar LocalPath is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

<<<<<<< HEAD
    console.log(`${avatar}`);


=======


    console.log(`avatar: ${avatar}`)


>>>>>>> 7f2bb969cef493d9e489f5754fcd2ba5656e96a7
    if (!avatar) {
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

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user in database")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    // req.body => data
    // userName aur email user se len gy.
    // find the user from database if its is exsist or not
    // password check 
    // access token aur refresh token generate kren gy
    // send in secure cookie
    // send response

    const { userName, email, password } = req.body

    if (!userName || !email) {
        throw new ApiError(400, "userName or email is required")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully"))

})

const logOutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "user loged out")
        )
})

export { registerUser, loginUser, logOutUser }