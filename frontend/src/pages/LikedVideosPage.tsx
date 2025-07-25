// @ts-ignore
import ColorThief from "colorthief";

import { Button } from "@/components/Button";
import { VIEWS_FORMATTER } from "@/components/VideoGridItem";
import { useGetLikedVideosQuery } from "@/slices/likeApiSlice";
import { useGetCurrentUserQuery } from "@/slices/usersApiSlice";
import FormatDuration from "@/utils/FormatDuration";
import { formatTimeAgo } from "@/utils/FormatTimeAgo";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";

interface ILikedVideo {
  _id: string;
  likedBy: string;
  video: {
    _id: string;
    duration: number;
    thumbnail: string;
    title: string;
    views: number;
    createdAt: Date;
    owner: {
      avatar: string;
      fullname: string;
      username: string;
    };
  };
}

const LikedVideosPage = () => {
  const [gradient, setGradient] = useState("");

  const {
    data: likedVideos,
    isLoading: isLikedVideosLoading,
    refetch: refetchLikedVideos,
  } = useGetLikedVideosQuery({});

  const { data: loggedInUser } = useGetCurrentUserQuery(null);

  useEffect(() => {
    refetchLikedVideos();
  }, [refetchLikedVideos]);

  useEffect(() => {
    console.log("liked videos counts: ", likedVideos?.data?.length);

    if (likedVideos?.data?.length > 0) {
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.src = likedVideos?.data[0]?.video.thumbnail;

      img.onload = () => {
        const colorthief = new ColorThief();
        const dominantColor = colorthief.getColor(img);
        const palette = colorthief.getPalette(img, 2);

        const gradient = `linear-gradient(
          to bottom, 
          rgba(${dominantColor.join(",")}, 0.9), 
          rgba(${palette[1].join(",")}, 0.03)
        )`;

        setGradient(gradient);
      };
    }
  }, [likedVideos]);

  const noVideosFound = !isLikedVideosLoading && !likedVideos?.data?.length;

  return (
    <div className="lg:overflow-y-hidden gap-14 grid grid-cols-1 lg:grid-cols-[360px,minmax(0,1fr)]">
      <section
        className="mt-2 lg:ml-10 lg:sticky top-0  flex flex-col px-4 py-2 rounded-2xl w-full"
        style={{ background: gradient }}
      >
        <img
          className="mt-4 rounded-xl object-cover w-full"
          src={likedVideos?.data[0].video?.thumbnail}
        />

        <h1 className="text-2xl font-bold mt-4 mx-1 tracking-tight">
          Liked videos
        </h1>

        <div className="mt-4 mx-1">
          <p className="text-xl lg:text-lg">
            {loggedInUser?.data?.fullname || "User"}
          </p>
          <p className="text-lg lg:text-[16px]">
            {likedVideos?.data.length} Videos
          </p>
        </div>
      </section>
      
      <section className="py-2 mt-2 mr-5 flex-shrink-0 overflow-y-auto">
        {likedVideos?.data?.map((video: ILikedVideo) => (
          <div
            key={video.video._id}
            className="group relative flex gap-2 w-full hover:bg-secondary-marginal p-2 rounded-xl mb-2"
          >
            <a
              href={`/watch?v=${video.video._id}`}
              className="relative flex-shrink-0"
            >
              <img
                className="h-32 w-56 object-cover mx-2 rounded-lg"
                src={video.video.thumbnail}
              />
              <div className="absolute bottom-1 right-3 bg-secondary-marginal-dark bg-opacity-90 text-white font-semibold md:text-sm px-1 py-0.5 rounded">
                {FormatDuration(video.video.duration)}
              </div>
            </a>

            <div
              className={`absolute right-1 top-1/2 -translate-y-1/2 lg:opacity-0 group-hover:opacity-100`}
            >
              <Button variant="ghost" size="icon">
                <EllipsisVertical size={20} className="cursor-pointer" />
              </Button>
            </div>

            <a
              href={`/watch?v=${video.video._id}`}
              className="flex flex-col flex-1  min-w-0"
            >
              <div className="text-base font-bold line-clamp-2">
                {video.video.title}
              </div>
              <div className="flex flex-wrap gap-0 items-start md:flex-row md:gap-2 md:items-center flex-col text-secondary-marginal-text text-xs">
                <p className="font-medium">{video.video.owner.fullname}</p>
                <div className="text-secondary-marginal-text hidden sm:block">
                  • {VIEWS_FORMATTER.format(video.video.views)} Views •{" "}
                  {formatTimeAgo(new Date(video.video.createdAt))}
                </div>
              </div>
            </a>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LikedVideosPage;
