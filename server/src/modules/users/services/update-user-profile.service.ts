import { User } from "@/modules/users/users.model";

import { FileData } from "@/shared/providers/media/media.provider";
import { buildURL, uploadToImageKit } from "@/shared/providers/media/imagekit/imagekit.provider";

import { UpdateUserProfileInput } from "@/modules/users/users.schemas";

import { UserNotFoundError } from "@/shared/errors/user/not-found.error";

type UpdateUserProfileData = UpdateUserProfileInput & {
  loggedUserId: string,
  profileImage?: FileData,
  coverImage?: FileData,
}

export async function updateUserProfileService({
  loggedUserId,
  full_name,
  username,
  bio,
  location,
  coverImage,
  profileImage
}: UpdateUserProfileData) {
  const tempUser = await User.findById(loggedUserId);

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
      tempPath: profileImage.tempPath,
      mimetype: profileImage.mimetype
    });

    const url = buildURL(uploadedImage.url, {
      transformation: [
        { quality: 90 },
        { format: 'webp' },
        { width: '512' }
      ]
    });

    newUserData.profile_picture = url;
  }

  // Update the cover picture
  if (coverImage) {
    const uploadedImage = await uploadToImageKit({
      fieldname: coverImage.fieldname,
      filename: coverImage.filename,
      tempPath: coverImage.tempPath,
      mimetype: coverImage.mimetype
    });

    const url = buildURL(uploadedImage.url, {
      transformation: [
        { quality: 90 },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    newUserData.cover_photo = url;
  }

  return await User.findByIdAndUpdate(loggedUserId, newUserData, { new: true });
}