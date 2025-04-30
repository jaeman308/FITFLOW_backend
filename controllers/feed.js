// // // Get posts from users the current user follows
// // router.get('/feed/following', async (req, res) => {
// //     try {
// //       const currentUser = await User.findById(req.user._id); // assuming JWT auth
// //       const posts = await Post.find({ author: { $in: currentUser.following } })
// //         .sort({ createdAt: -1 })
// //         .populate('author', 'username')
// //         .populate('community', 'name');
// //       res.json(posts);
// //     } catch (err) {
// //       res.status(500).json({ message: err.message });
// //     }
// //   });



// // Get posts from communities the user has joined
// router.get('/feed/communities', async (req, res) => {
//     try {
//       const currentUser = await User.findById(req.user._id);
//       const posts = await Post.find({ community: { $in: currentUser.communities } })
//         .sort({ createdAt: -1 })
//         .populate('author', 'username')
//         .populate('community', 'name');
//       res.json(posts);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });