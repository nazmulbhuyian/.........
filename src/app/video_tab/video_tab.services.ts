import { IVideo_tabInterface } from "./video_tab.interface";
import Video_tabModel from "./video_tab.model";

// Find A Video_tab
export const findAVideo_tabServices = async (
  product_id: string
): Promise<IVideo_tabInterface | null> => {
  const findVideo_tab = await Video_tabModel.findOne({
    product_id: product_id,
  });
  return findVideo_tab;
};

// Create A Video_tab
export const postVideo_tabServices = async (
  data: IVideo_tabInterface
): Promise<IVideo_tabInterface | {}> => {
  const createVideo_tab = await Video_tabModel.create(data);
  return createVideo_tab;
};

// Find all Video_tab
export const findAllVideo_tabServices = async (
  limit: number,
  skip: number
): Promise<IVideo_tabInterface[] | []> => {
  const findVideo_tab: IVideo_tabInterface[] | [] = await Video_tabModel.find(
    {}
  )
    .populate([
      {
        path: "product_id",
        populate: {
          path: "product_color_id",
          model: "colors",
        },
      },
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v");
  return findVideo_tab;
};

// Find All Dashboard Video
export const findAllDashboardVideoServices = async (
  limit: number,
  skip: number
): Promise<IVideo_tabInterface[]> => {
  const allVideo = await Video_tabModel.find({})
    .populate([
      {
        path: "product_id",
        populate: {
          path: "product_color_id",
          model: "colors",
        },
      },
    ])
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  return allVideo;
};

// Update a Video_tab
export const updateVideo_tabServices = async (
  data: IVideo_tabInterface,
  _id: string
): Promise<IVideo_tabInterface | any> => {
  const updateVideo_tabInfo: IVideo_tabInterface | null =
    await Video_tabModel.findOne({
      _id: _id,
    });
  if (!updateVideo_tabInfo) {
    return {};
  }
  const Video_tab = await Video_tabModel.updateOne(updateVideo_tabInfo, data, {
    runValidators: true,
  });
  return Video_tab;
};

// Delete a Video_tab
export const deleteVideo_tabServices = async (
  _id: string
): Promise<IVideo_tabInterface | any> => {
  const Video_tab = await Video_tabModel.deleteOne(
    { _id: _id },
    {
      runValidators: true,
    }
  );
  return Video_tab;
};
