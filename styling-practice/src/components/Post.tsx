//import clsx from 'clsx'

type Post = {
  profile: {
    avatar: string,
    name: string
  },
  group: string,
  time: string,
  img: string,
  postDescription: string,
  likeCount: number,
  commentCount: number
}

type PostProps = {
  postData: Post
}

export function Post({ postData }: PostProps) {
  return(
    <div className="flex flex-row gap-5 p-2 justify-center">
      {/* col 1: profile avatar */}
      <div className="w-30">
        <img 
          src={postData.profile.avatar}
          alt="profile avatar"
          className="aspect-square rounded-full self-start"
        />
      </div>
      {/* col 2: post content */}
      <div className="flex flex-col gap-4">
        {/* post context */}
        <div className="text-textGray text-md font-light">
          <div><span className="text-black font-medium">{postData.profile.name}</span> in Group {postData.group}</div>
          <div>{postData.time}</div>
        </div>
        <div className="aspect-square w-1/2">
          <img 
            src={postData.img}
            alt="image post"
            className="rounded-sm object-cover h-full w-full"
          />
        </div>
        <div className="text-xl font-light">{postData.postDescription}</div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-2">
            <img 
              src="/public/assets/icons/heart.svg"
              className="max-w-1/4"
            />
            <div>{postData.likeCount} likes</div>
          </div>
          <div className="flex flex-row gap-2">
            <img 
              src="/public/assets/icons/comment.svg"
              className="max-w-1/6"
            />
            <div>{postData.commentCount} comments</div>
          </div>
        </div>
      </div>
    </div>
  )
}