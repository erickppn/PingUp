import fs from "node:fs";

import { User } from "@/modules/users/users.model";

import { buildURL, uploadToImageKit } from "@/shared/providers/media/imagekit/imagekit.provider";

import { UpdateUserProfileInput } from "@/modules/users/users.schemas";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";
import { ImageUploadError } from "@/shared/errors/uploads/image-upload.error";

interface UploadedFile {
  fieldname: string;
  filename: string;
  mimetype: string;
  tempPath: string;
}

type UpdateUserProfileData = UpdateUserProfileInput & {
  userId: string,
  profileImage?: UploadedFile,
  coverImage?: UploadedFile,
}

export async function updateUserProfileService({
  userId,
  full_name,
  username,
  bio,
  location,
  coverImage,
  profileImage
}: UpdateUserProfileData) {
  const tempUser = await User.findById(userId);

  if (!tempUser) {
    throw new UserNotFoundError();
  }

  let newUsername = username;

  !newUsername && (newUsername = tempUser.username);

  if (tempUser.username !== newUsername) {
    const user = await User.findOne({ username: newUsername });

    if (user) {
      // we will not change the username if it is already taken
      newUsername = tempUser.username;
    }
  }

  const newUserData = {
    username: newUsername,
    bio,
    location,
    full_name,
    profile_picture: tempUser.profile_picture,
    cover_photo: tempUser.cover_photo
  }

  // Update and upload the profile picture
  if (profileImage) {
    const uploadedImage = await uploadToImageKit({
      fieldname: profileImage.fieldname,
      filename: profileImage.filename,
      filePath: profileImage.tempPath
    });

    if (!uploadedImage || !uploadedImage.url) {
      throw new ImageUploadError("profile");
    }

    const url = buildURL(uploadedImage.url, {
      transformation: [
        { quality: 90 },
        { format: 'webp' },
        { width: '512' }
      ]
    });

    newUserData.profile_picture = url;

    //delete the temp file
    fs.unlink(profileImage.tempPath, (error) => {
      if (error) console.log(error);
    });
  }

  // Update the cover picture
  if (coverImage) {
    const uploadedImage = await uploadToImageKit({
      fieldname: coverImage.fieldname,
      filename: coverImage.filename,
      filePath: coverImage.tempPath
    });

    if (!uploadedImage || !uploadedImage.url) {
      throw new ImageUploadError("cover");
    }

    const url = buildURL(uploadedImage.url, {
      transformation: [
        { quality: 90 },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    newUserData.cover_photo = url;

    //delete the temp file
    fs.unlink(coverImage.tempPath, (error) => {
      if (error) console.log(error);
    });
  }

  return await User.findByIdAndUpdate(userId, newUserData, { new: true });
}