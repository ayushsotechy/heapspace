export const problems = [
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: "1 ≤ n ≤ 45",
    testCases: [
      { input: "3", output: "3" }
    ]
  },
  {
    title: "Min Cost Climbing Stairs",
    slug: "min-cost-climbing-stairs",
    difficulty: "Easy",
    description: "You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps. Return the minimum cost to reach the top of the floor.",
    constraints: "2 ≤ cost.length ≤ 1000",
    testCases: [
      { input: "10 15 20", output: "15" }
    ]
  },
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you is that adjacent houses have security systems connected. Return the maximum amount of money you can rob tonight without alerting the police.",
    constraints: "1 ≤ nums.length ≤ 100",
    testCases: [
      { input: "1 2 3 1", output: "4" }
    ]
  },
  {
    title: "House Robber II",
    slug: "house-robber-ii",
    difficulty: "Medium",
    description: "You are a professional robber planning to rob houses along a street. The houses are arranged in a circle. Return the maximum amount of money you can rob tonight without alerting the police.",
    constraints: "1 ≤ nums.length ≤ 100",
    testCases: [
      { input: "2 3 2", output: "3" }
    ]
  },
  {
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "Medium",
    description: "Given a string s, return the longest palindromic substring in s.",
    constraints: "1 ≤ s.length ≤ 1000",
    testCases: [
      { input: "babad", output: "bab" }
    ]
  },
  {
    title: "Palindromic Substrings",
    slug: "palindromic-substrings",
    difficulty: "Medium",
    description: "Given a string s, return the number of palindromic substrings in it.",
    constraints: "1 ≤ s.length ≤ 1000",
    testCases: [
      { input: "abc", output: "3" }
    ]
  },
  {
    title: "Decode Ways",
    slug: "decode-ways",
    difficulty: "Medium",
    description: "A message containing letters from A-Z can be encoded into numbers using the mapping 'A' -> '1', 'B' -> '2', ... 'Z' -> '26'. Given a string s containing only digits, return the number of ways to decode it.",
    constraints: "1 ≤ s.length ≤ 100",
    testCases: [
      { input: "12", output: "2" }
    ]
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    constraints: "1 ≤ coins.length ≤ 12, 0 ≤ amount ≤ 10⁴",
    testCases: [
      { input: "1 2 5\n11", output: "3" } // Coins first, then Amount
    ]
  },
  {
    title: "Maximum Product Subarray",
    slug: "maximum-product-subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
    constraints: "1 ≤ nums.length ≤ 2 * 10⁴",
    testCases: [
      { input: "2 3 -2 4", output: "6" }
    ]
  },
  {
    title: "Word Break",
    slug: "word-break",
    difficulty: "Medium",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    constraints: "1 ≤ s.length ≤ 300, 1 ≤ wordDict.length ≤ 1000",
    testCases: [
      { input: "leetcode\nleet code", output: "true" } // String s, then Dictionary words
    ]
  },
  {
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    constraints: "1 ≤ nums.length ≤ 2500",
    testCases: [
      { input: "10 9 2 5 3 7 101 18", output: "4" }
    ]
  },
  {
    title: "Partition Equal Subset Sum",
    slug: "partition-equal-subset-sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.",
    constraints: "1 ≤ nums.length ≤ 200",
    testCases: [
      { input: "1 5 11 5", output: "true" }
    ]
  },
  {
    title: "Unique Paths",
    slug: "unique-paths",
    difficulty: "Medium",
    description: "There is a robot on an m x n grid. Return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
    constraints: "1 ≤ m, n ≤ 100",
    testCases: [
      { input: "3 7", output: "28" } // m then n
    ]
  },
  {
    title: "Longest Common Subsequence",
    slug: "longest-common-subsequence",
    difficulty: "Medium",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    constraints: "1 ≤ text1.length, text2.length ≤ 1000",
    testCases: [
      { input: "abcde ace", output: "3" }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock with Cooldown",
    slug: "best-time-to-buy-and-sell-stock-with-cooldown",
    difficulty: "Medium",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve with the cooldown restriction.",
    constraints: "1 ≤ prices.length ≤ 5000",
    testCases: [
      { input: "1 2 3 0 2", output: "3" }
    ]
  },
  {
    title: "Edit Distance",
    slug: "edit-distance",
    difficulty: "Hard",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
    constraints: "0 ≤ word1.length, word2.length ≤ 500",
    testCases: [
      { input: "horse ros", output: "3" }
    ]
  },
  {
    title: "Target Sum",
    slug: "target-sum",
    difficulty: "Medium",
    description: "You are given an integer array nums and an integer target. Return the number of different expressions that you can build, which evaluates to target.",
    constraints: "1 ≤ nums.length ≤ 20",
    testCases: [
      { input: "1 1 1 1 1\n3", output: "5" } // Array first, then Target (newline separated)
    ]
  },
  {
    title: "Interleaving String",
    slug: "interleaving-string",
    difficulty: "Medium",
    description: "Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.",
    constraints: "0 ≤ s1.length, s2.length ≤ 100",
    testCases: [
      { input: "aabcc dbbca aadbbcbcac", output: "true" }
    ]
  },
  {
    title: "Distinct Subsequences",
    slug: "distinct-subsequences",
    difficulty: "Hard",
    description: "Given two strings s and t, return the number of distinct subsequences of s which equals t.",
    constraints: "1 ≤ s.length, t.length ≤ 1000",
    testCases: [
      { input: "rabbbit rabbit", output: "3" }
    ]
  },
  {
    title: "Burst Balloons",
    slug: "burst-balloons",
    difficulty: "Hard",
    description: "You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. Return the maximum coins you can collect.",
    constraints: "n == nums.length, 1 ≤ n ≤ 300",
    testCases: [
      { input: "3 1 5 8", output: "167" }
    ]
  }
];