export const problems = [
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    constraints: "-2³¹ ≤ x ≤ 2³¹ - 1",
    testCases: [
      { input: "x = 121", output: "true" }
    ]
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: "1 ≤ s.length ≤ 10⁴",
    testCases: [
      { input: "s = '()[]{}'", output: "true" }
    ]
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    constraints: "0 ≤ node count ≤ 50",
    testCases: [
      { input: "l1 = [1,2,4], l2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
    ]
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray which has the largest sum and return its sum.",
    constraints: "1 ≤ nums.length ≤ 10⁵",
    testCases: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" }
    ]
  },
  {
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    constraints: "1 ≤ s.length ≤ 10⁵",
    testCases: [
      { input: "s = ['h','e','l','l','o']", output: "['o','l','l','e','h']" }
    ]
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: "1 ≤ n ≤ 45",
    testCases: [
      { input: "n = 3", output: "3" }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    description: "Find the maximum profit you can achieve by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    constraints: "1 ≤ prices.length ≤ 10⁵",
    testCases: [
      { input: "prices = [7,1,5,3,6,4]", output: "5" }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: "0 ≤ s.length ≤ 5 * 10⁴",
    testCases: [
      { input: "s = 'abcabcbb'", output: "3" }
    ]
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    constraints: "3 ≤ nums.length ≤ 3000",
    testCases: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
    ]
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    description: "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    constraints: "2 ≤ n ≤ 10⁵",
    testCases: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }
    ]
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    constraints: "1 ≤ strs.length ≤ 10⁴",
    testCases: [
      { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" }
    ]
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    description: "Given the array nums after a possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    constraints: "1 ≤ nums.length ≤ 5000",
    testCases: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" }
    ]
  },
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth.",
    constraints: "0 ≤ nodes count ≤ 10⁴",
    testCases: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" }
    ]
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    description: "Return true if any value appears at least twice in the array, and return false if every element is distinct.",
    constraints: "1 ≤ nums.length ≤ 10⁵",
    testCases: [
      { input: "nums = [1,2,3,1]", output: "true" }
    ]
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    description: "Return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    constraints: "2 ≤ nums.length ≤ 10⁵",
    testCases: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }
    ]
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    constraints: "1 ≤ s.length, t.length ≤ 5 * 10⁴",
    testCases: [
      { input: "s = 'anagram', t = 'nagaram'", output: "true" }
    ]
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    difficulty: "Easy",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    constraints: "0 ≤ node count ≤ 10⁴",
    testCases: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true" }
    ]
  },
  {
    title: "Number of 1 Bits",
    slug: "number-of-1-bits",
    difficulty: "Easy",
    description: "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
    constraints: "n must be a 32-bit unsigned integer",
    testCases: [
      { input: "n = 00000000000000000000000000001011", output: "3" }
    ]
  },
  {
    title: "Missing Number",
    slug: "missing-number",
    difficulty: "Easy",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    constraints: "n == nums.length, 1 ≤ n ≤ 10⁴",
    testCases: [
      { input: "nums = [3,0,1]", output: "2" }
    ]
  },
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    description: "You are a professional robber. Each house has a certain amount of money stashed. You cannot rob two adjacent houses. Return the maximum amount of money you can rob tonight.",
    constraints: "1 ≤ nums.length ≤ 100",
    testCases: [
      { input: "nums = [1,2,3,1]", output: "4" }
    ]
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    description: "Return the fewest number of coins that you need to make up a given amount. If that amount of money cannot be made up, return -1.",
    constraints: "1 ≤ coins.length ≤ 12, 0 ≤ amount ≤ 10⁴",
    testCases: [
      { input: "coins = [1,2,5], amount = 11", output: "3" }
    ]
  },
  {
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: "Easy",
    description: "Given a string s, return true if it is a palindrome, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters.",
    constraints: "1 ≤ s.length ≤ 2 * 10⁵",
    testCases: [
      { input: "s = 'A man, a plan, a canal: Panama'", output: "true" }
    ]
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
    constraints: "0 ≤ nums.length ≤ 10⁵",
    testCases: [
      { input: "nums = [100,4,200,1,3,2]", output: "4" }
    ]
  },
  {
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    constraints: "0 ≤ nodes count ≤ 100",
    testCases: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
    ]
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    constraints: "1 ≤ intervals.length ≤ 10⁴",
    testCases: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }
    ]
  }
];