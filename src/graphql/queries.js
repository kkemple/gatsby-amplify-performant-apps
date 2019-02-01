// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPostLike = `query GetPostLike($id: ID!) {
  getPostLike(id: $id) {
    id
    userId
    postId
  }
}
`;
export const listPostLikes = `query ListPostLikes(
  $filter: ModelPostLikeFilterInput
  $limit: Int
  $nextToken: String
) {
  listPostLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      postId
    }
    nextToken
  }
}
`;
